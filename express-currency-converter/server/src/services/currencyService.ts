import { NbuApiService } from './nbuApiService.js';
import { cache, CACHE_KEYS } from '../config/cache.js';
import { UAH_CODE } from '../config/constants.js';
import { 
  Currency, 
  NBUCurrencyRate, 
  ConversionRequest, 
  ConversionResult,
  RatesResponse 
} from '../types/currency.types.js';

export class CurrencyService {
  // Конвертуємо дані НБУ в наш формат
  private static convertNbuToOurFormat(nbuRates: NBUCurrencyRate[]): Currency[] {
    const currencies: Currency[] = nbuRates.map(rate => ({
      code: rate.cc,
      name: rate.txt,
      rate: rate.rate,
      date: rate.exchangedate
    }));

    // Додаємо гривню як базову валюту
    currencies.push({
      code: UAH_CODE,
      name: 'Українська гривня',
      rate: 1,
      date: nbuRates[0]?.exchangedate || new Date().toLocaleDateString('uk-UA')
    });

    return currencies;
  }

  // Отримуємо всі курси (з кешем)
  static async getAllRates(): Promise<RatesResponse> {
    try {
      // Спробуємо взяти з кешу
      const cachedRates = cache.get<Currency[]>(CACHE_KEYS.ALL_RATES);
      const lastUpdate = cache.get<string>(CACHE_KEYS.LAST_UPDATE);

      if (cachedRates && lastUpdate) {
        console.log('📦 Повертаємо курси з кешу');
        return {
          rates: cachedRates,
          lastUpdated: lastUpdate,
          source: 'cache'
        };
      }

      // Якщо кеш порожній - запитуємо з API
      console.log('🌐 Отримуємо свіжі курси з API НБУ');
      const nbuRates = await NbuApiService.fetchExchangeRates();
      const currencies = this.convertNbuToOurFormat(nbuRates);
      const currentTime = new Date().toISOString();

      // Зберігаємо в кеш
      cache.set(CACHE_KEYS.ALL_RATES, currencies);
      cache.set(CACHE_KEYS.LAST_UPDATE, currentTime);

      console.log('💾 Курси збережено в кеш');

      return {
        rates: currencies,
        lastUpdated: currentTime,
        source: 'api'
      };
    } catch (error) {
      console.error('❌ Помилка при отриманні курсів:', error);
      throw error;
    }
  }

  // Отримуємо курс конкретної валютної пари
  static async getExchangeRate(from: string, to: string): Promise<number> {
    const rates = await this.getAllRates();
    
    const fromCurrency = rates.rates.find(r => r.code === from.toUpperCase());
    const toCurrency = rates.rates.find(r => r.code === to.toUpperCase());

    if (!fromCurrency) {
      throw new Error(`Валюта ${from} не знайдена`);
    }
    if (!toCurrency) {
      throw new Error(`Валюта ${to} не знайдена`);
    }

    // Якщо одна з валют - гривня
    if (from.toUpperCase() === UAH_CODE) {
      return 1 / toCurrency.rate;
    }
    if (to.toUpperCase() === UAH_CODE) {
      return fromCurrency.rate;
    }

    // Конвертація через гривню: USD -> UAH -> EUR
    return fromCurrency.rate / toCurrency.rate;
  }

  // Конвертуємо суму з однієї валюти в іншу
  static async convertCurrency(request: ConversionRequest): Promise<ConversionResult> {
    try {
      const rate = await this.getExchangeRate(request.from, request.to);
      const result = request.amount * rate;
      
      const rates = await this.getAllRates();

      return {
        from: request.from.toUpperCase(),
        to: request.to.toUpperCase(),
        amount: request.amount,
        result: Math.round(result * 10000) / 10000, // Округлюємо до 4 знаків
        rate: Math.round(rate * 10000) / 10000,
        date: rates.lastUpdated
      };
    } catch (error) {
      console.error('❌ Помилка при конвертації:', error);
      throw error;
    }
  }

  // Отримуємо список доступних валют
  static async getAvailableCurrencies(): Promise<string[]> {
    const rates = await this.getAllRates();
    return rates.rates.map(r => r.code).sort();
  }
}