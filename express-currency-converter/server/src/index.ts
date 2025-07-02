import { app } from './server.js';
import { PORT } from './config/constants.js';
import { Logger } from './utils/logger.js';

// Запуск сервера
app.listen(PORT, () => {
  Logger.success(`🚀 Сервер запущено на порту ${PORT}`);
  Logger.info(`📡 API: http://localhost:${PORT}/api`);
  Logger.info(`🏥 Ping: http://localhost:${PORT}/ping`);
});

// Экспорт для Vite
export { app };