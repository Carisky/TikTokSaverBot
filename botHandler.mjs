import { handleAntiSpam } from "./utils/AntiSpam.mjs";
// Обработка входящих сообщений
export function handleIncomingMessages(bot) {
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (text && text.includes('tiktok.com')) {
            handleAntiSpam(bot, chatId, text);
        } else {
            bot.sendMessage(chatId, 'ℹ️ Пожалуйста, отправьте ссылку на видео из TikTok.');
        }
    });

    // Обработка ошибок
    bot.on("polling_error", (err) => console.log(err));
}


