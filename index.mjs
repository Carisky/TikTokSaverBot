import TelegramBot from 'node-telegram-bot-api';
import alldl from 'rahad-media-downloader';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
// Замените 'YOUR_TELEGRAM_BOT_TOKEN' на токен вашего бота

const token = process.env.TELEGRAM_BOT_API
const bot = new TelegramBot(token, { polling: true });

// Обработка входящих сообщений
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Проверка наличия ссылки на TikTok
    if (text && text.includes('tiktok.com')) {
        try {
            // Отправка сообщения о начале загрузки
            await bot.sendMessage(chatId, '🔄 Загружаю видео, пожалуйста, подождите...');

            // Использование функции rahadtikdl для получения информации о видео
            const result = await alldl.rahadtikdl(text);

            // Проверка наличия ссылки на видео без водяных знаков
            if (result.data && result.data.noWatermarkMp4) {
                const videoUrl = result.data.noWatermarkMp4;

                // Загрузка видео с использованием fetch
                const response = await fetch(videoUrl);
                if (!response.ok) throw new Error(`Не удалось скачать видео: ${response.statusText}`);
                const videoBuffer = await response.buffer();  // Используем buffer(), а не arrayBuffer()

                // Отправка видео пользователю
                await bot.sendVideo(chatId, videoBuffer, {
                    caption: result.title || 'Ваше TikTok видео'
                }, {
                    filename: 'video.mp4',
                    contentType: 'video/mp4'
                });

            } else {
                // Если не удалось получить ссылку на видео
                await bot.sendMessage(chatId, '❌ Не удалось получить ссылку на видео. Пожалуйста, проверьте ссылку и попробуйте снова.');
            }
        } catch (error) {
            console.error('Ошибка при загрузке видео:', error);
            await bot.sendMessage(chatId, '⚠️ Произошла ошибка при загрузке видео. Пожалуйста, попробуйте позже.');
        }
    } else {
        // Если сообщение не содержит ссылку на TikTok
        await bot.sendMessage(chatId, 'ℹ️ Пожалуйста, отправьте ссылку на видео из TikTok.');
    }
});

// Обработка ошибок
bot.on("polling_error", (err) => console.log(err));
