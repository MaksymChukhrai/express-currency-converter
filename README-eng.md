# Currency Converter (NBU)

ua [Read in Ukrainian](README.md)

An application for currency conversion using the National Bank of Ukraine API. Consists of a React frontend and a Node.js backend.

## 🎯 Implemented Features

### ✅ Backend Service:
- Retrieves exchange rates from the NBU API
- API endpoint for conversion (`/api/convert`)
- Conversion between any currencies
- Data caching for 24 hours
- 47 available currencies

### ✅ React UI:
- Form with currency selectors ✅
- Amount input field ✅
- "Convert" button ✅
- Displays conversion result ✅
- Validation (positive numbers) ✅
- Loads all currencies from the backend ✅

### ✅ Caching and Optimization:
- 24-hour cache ✅
- Avoids unnecessary API calls ✅
- Fast conversion via cache ✅

## 🏗️ Project Structure


```
express-currency-converter/
├── client/        # React frontend
├── server/        # Node.js backend
└── README.md      # Documentation
```

### Backend Structure (`server/src/`)

```
server/src/
├── config/
│   ├── constants.ts           # Constants (NBU API URL, cache time, port)
│   └── cache.ts               # NodeCache configuration for caching
│
├── controllers/
│   └── currencyController.ts  # HTTP request handlers (getAllRates, convert, etc.)
│
├── services/
│   ├── currencyService.ts     # Business logic (conversion, cache handling)
│   └── nbuApiService.ts       # Interaction with NBU API
│
├── models/
│   └── Currency.ts            # TypeScript types for currencies
├── routes/
│   └── currencyRoutes.ts      # API routes (/api/rates, /api/convert)
│
├── middleware/
│   ├── errorHandler.ts        # Global error handling
│   └── validation.ts          # Input data validation
│
├── utils/
│   ├── logger.ts              # Request logging
│   └── validators.ts          # Validators for currencies and amounts
│
├── types/
│   └── currency.types.ts      # TypeScript interfaces
│
├── index.ts                   # Entry point (server startup)
└── server.ts                  # Express app configuration
```

### Frontend Structure (`client/src/`)

```
client/src/
├── components/
│ └── CurrencyConverter.tsx  # Main converter component
├── App.tsx                  # Main application component
├── main.tsx                 # React entry point
├── App.css                  # Application styles
└── index.css                # Global styles
```

## 🚀 Project Launch

### Requirements
- **Node.js 18+**
- **npm** or **yarn**

### Backend Launch

First terminal:

```bash
cd your_local_folder/express-currency-converter/server
`npm install`
`npm run dev`

Expected result:
> backend@1.0.0 dev
> vite dev

  VITE v6.3.5  ready in 789 ms

  ➜  Local:   http://localhost:8000/
  ➜  Network: http://192.168.1.4:8000/
  ```

### Frontend Launch

Second terminal:
```bash
cd your_local_folder/express-currency-converter/client
npm install
npm run dev

Expected result:
> client@0.0.0 dev
> vite

  ➜  Local:   http://localhost:5173/
  ```

### Application Access

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **Health Check:** http://localhost:8000/ping

## 🔧 API Endpoints

| Method | Path                   | Description                        |
|--------|------------------------|------------------------------------|
| GET    | /api/rates             | Get all exchange rates             |
| GET    | /api/rates/:from/:to   | Get exchange rate for a currency pair |
| POST   | /api/convert           | Convert an amount                  |
| GET    | /api/currencies        | List available currencies          |
| GET    | /ping                  | Health check                       |


## 📋 Conversion Example
```bash
curl -X POST http://localhost:8000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"from":"USD","to":"UAH","amount":100}'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "from": "USD",
    "to": "UAH", 
    "amount": 100,
    "result": 4181.16,
    "rate": 41.8116,
    "date": "2025-07-02T13:20:24.033Z"
  },
  "message": "100 USD = 4181.16 UAH"
}
```

## 🛠️ Technologies

**Backend:**
- Node.js + TypeScript
- Express.js — web server
- Vite — development tool
- node-cache — caching
- cross-fetch — HTTP requests

**Frontend:**
- React 19 + TypeScript
- Vite — build and development
- Simple CSS — styling

## 📦 Features


- **Caching:** Exchange rates are cached for 24 hours
- **Validation:** Checks for correct currency codes and amounts
- **Error Handling:** Centralized error management
- **Logging:** Detailed logs of requests and operations
- **TypeScript:** Full code type safety
- **Responsive:** Adaptive design for all devices

## 🌐 Data Source

The application uses the official National Bank of Ukraine API:

- **URL:** https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json
- **Update Frequency:** Daily
- **Available Currencies:** 47 (including metals)

## 📝 Logging

The backend outputs detailed logs:

ℹ️ [INFO] GET /api/currencies

🌐 Fetching fresh rates from NBU API

🔄 Requesting data from NBU API...

✅ Received 46 currency rates from NBU

💾 Rates saved to cache

📦 Returning rates from cache


**Author: [Maksym Chukhrai](https://www.mchukhrai.com/)**

