import dotenv from 'dotenv';
import { fileURLToPath } from 'url'
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

export const config = {
    token : process.env.TELEGRAM_BOT_API,
    PROCESS_INTERVAL : 5000,
    MAX_QUEUE_LENGTH : 3
};



export const getImagePath = (imageName) => path.join(__dirname, 'images', imageName);