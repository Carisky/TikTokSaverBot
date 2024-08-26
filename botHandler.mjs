import { handleAntiSpam } from "./utils/AntiSpam.mjs";
// Обработка входящих сообщений
export function handleIncomingMessages(bot) {
  bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text && text.includes("tiktok.com")) {
      handleAntiSpam(bot, chatId, text);
    } else if (text.includes("youtube.com")) {
      bot.sendMessage(chatId, "youtube ссылки в разработке");
    } else {
      bot.sendMessage(chatId, "ℹ️ Пожалуйста, отправьте исправную ссылку.");
    }
  });

  // Обработка ошибок
  bot.on("polling_error", (err) => console.log(err));
}
