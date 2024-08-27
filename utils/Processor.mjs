import fetch from 'node-fetch';
import alldl from 'rahad-media-downloader';

const queue = []; // Очередь для обработки запросов

class Processor {
    static async processTikTok(url) {
        try {
            const result = await alldl.rahadtikdl(url);

            if (result.data && result.data.noWatermarkMp4) {
                const videoUrl = result.data.noWatermarkMp4;
                const response = await fetch(videoUrl);
                if (!response.ok) throw new Error(`Не удалось скачать видео: ${response.statusText}`);
                const videoBuffer = await response.buffer();
                return {
                    buffer: videoBuffer,
                    caption: result.title || 'Ваше TT видео',
                    type: 'video/mp4'
                };
            } else {
                throw new Error('Не удалось получить ссылку на видео. Пожалуйста, проверьте ссылку и попробуйте снова.');
            }
        } catch (error) {
            throw new Error(`Ошибка при обработке TikTok: ${error.message}`);
        }
    }

    // Дополнительные методы для обработки других типов контента
    // Пример для Instagram:
    static async processInstagram(url) {
        // Ваш код для обработки Instagram видео/фото
    }

    // Пример для YouTube:
    static async processYouTube(url) {
        const result = await alldl.rahadytdl(url);
        console.log(result);
    }

    // Метод для выбора нужного обработчика в зависимости от URL
    static async processContent(url) {
        if (url.includes('tiktok.com')) {
            return await this.processTikTok(url);
        } else if (url.includes('instagram.com')) {
            return await this.processInstagram(url);
        } else if (url.includes('youtube.com')) {
            return await this.processYouTube(url);
        } else {
            throw new Error('Неизвестный тип контента.');
        }
    }
}

// Функция обработки запроса из очереди
export async function processQueue(bot) {
    if (queue.length > 0) {
        const { chatId, text } = queue.shift(); // Удаляем первый элемент из очереди и начинаем его обработку

        try {
            await bot.sendMessage(chatId, '🔄 Загружаю контент, пожалуйста, подождите...');

            const result = await Processor.processContent(text);

            if (result) {
                const { buffer, caption, type } = result;
                await bot.sendVideo(chatId, buffer, {
                    caption: caption || 'Ваше видео',
                }, {
                    filename: 'content.mp4',
                    contentType: type
                });
            }
        } catch (error) {
            console.error('Ошибка при загрузке контента:', error);
            await bot.sendMessage(chatId, '⚠️ Произошла ошибка при загрузке контента. Пожалуйста, попробуйте позже.');
        }
    }
}

// Функция добавления запроса в очередь
export function addToQueue(item) {
    queue.push(item);
}

export function getQueueLength() {
    return queue.length;
}
