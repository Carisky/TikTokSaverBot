import TelegramBot from 'node-telegram-bot-api';
import { processQueue } from './utils/Processor.mjs';
import { handleIncomingMessages } from './botHandler.mjs';
import { config } from './config.mjs';

const token = config.token;
const bot = new TelegramBot(token, { polling: true });

// Запуск функции обработки очереди с заданным интервалом
setInterval(() => processQueue(bot), config.PROCESS_INTERVAL);

// Обработка входящих сообщений
handleIncomingMessages(bot);

console.log('Bot is running...');
