import { getQueueLength,addToQueue } from "./Processor.mjs";
import { config } from "../config.mjs";
import { getImagePath } from "../config.mjs";

export function handleAntiSpam(bot, chatId, text) {
    if (getQueueLength() < config.MAX_QUEUE_LENGTH) {
        addToQueue({ chatId, text });
        bot.sendMessage(chatId, `🔄 Ваша ссылка добавлена в очередь. Вы будете уведомлены, когда видео будет готово. Позиция в очереди: ${getQueueLength()}`);
    } else {
        const imagePath = getImagePath('anti_spam.jpg');
        const caption = 'Перестань спамити или найду тебя и разобью ебальник';
        bot.sendPhoto(chatId, imagePath, { caption });
    }
}
