import TelegramBot from 'node-telegram-bot-api';
import alldl from 'rahad-media-downloader';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // Определяем __filename
const __dirname = path.dirname(__filename); // Определяем __dirname

dotenv.config();

const token = process.env.TELEGRAM_BOT_API;
const bot = new TelegramBot(token, { polling: true });

const queue = []; // Очередь для обработки запросов
const PROCESS_INTERVAL = 30000; // Интервал обработки одного запроса (60 секунд)

// Функция обработки запроса из очереди
async function processQueue() {
    if (queue.length > 0) {
        const { chatId, text } = queue.shift(); // Удаляем первый элемент из очереди и начинаем его обработку

        try {
            await bot.sendMessage(chatId, '🔄 Загружаю видео, пожалуйста, подождите...');

            const result = await alldl.rahadtikdl(text);

            if (result.data && result.data.noWatermarkMp4) {
                const videoUrl = result.data.noWatermarkMp4;

                const response = await fetch(videoUrl);
                if (!response.ok) throw new Error(`Не удалось скачать видео: ${response.statusText}`);
                const videoBuffer = await response.buffer();

                await bot.sendVideo(chatId, videoBuffer, {
                    caption: result.title || 'Ваше TikTok видео'
                }, {
                    filename: 'video.mp4',
                    contentType: 'video/mp4'
                });
            } else {
                await bot.sendMessage(chatId, '❌ Не удалось получить ссылку на видео. Пожалуйста, проверьте ссылку и попробуйте снова.');
            }
        } catch (error) {
            console.error('Ошибка при загрузке видео:', error);
            await bot.sendMessage(chatId, '⚠️ Произошла ошибка при загрузке видео. Пожалуйста, попробуйте позже.');
        }
    }
}

// Запуск функции обработки очереди с заданным интервалом
setInterval(processQueue, PROCESS_INTERVAL);

// Обработка входящих сообщений
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text && text.includes('tiktok.com')) {
        if(queue.length < 3){
            queue.push({ chatId, text }); // Добавляем запрос в очередь
            bot.sendMessage(chatId, `🔄 Ваша ссылка добавлена в очередь. Вы будете уведомлены, когда видео будет готово. Позиция в очереди: ${queue.length}`);
        }else{

            const imagePath = path.join(__dirname, 'images', 'anti_spam.jpg'); // путь к изображению
            const caption = 'Перестань спамити или найду тебя и разобью ебальник';
            bot.sendPhoto(chatId, imagePath, { caption });
        }
        
    } else {
        bot.sendMessage(chatId, 'ℹ️ Пожалуйста, отправьте ссылку на видео из TikTok.');
    }
});

// Обработка ошибок
bot.on("polling_error", (err) => console.log(err));
