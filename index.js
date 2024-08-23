import TelegramBot from 'node-telegram-bot-api';
import { options } from './options.js';
import { sequelize } from './db.js';
import { UserModel } from './models.js';

const token = '7442588918:AAFgdnzRBD5jVsYRxQvusaCov5ROm5tWq1c';
const bot = new TelegramBot(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Now bot is wishing a number');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Guess the number`, options.gameOptions);
};

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (error) {
        console.log(error);
    }

    bot.setMyCommands([
        { command: '/start', description: 'Start the bot' },
        { command: '/info', description: 'Get info about an user' },
        { command: '/game', description: 'Play a game' },
    ]);

    bot.on('message', async (message) => {
        const text = message.text;
        const chatId = message.chat.id;

        try {
            if (text === '/start') {
                const foundUser = await UserModel.findOne({ where: { chatId: String(chatId) } });
                console.log(foundUser);
                if (foundUser) {
                    return bot.sendMessage(chatId, 'You have already started a bot');
                }
                await UserModel.create({ chatId });
                await bot.sendSticker(chatId, 'https://sl.combot.org/luntik3000/webp/2xf09fa493.webp');
                return bot.sendMessage(chatId, `Welcome to Luntik's bot`);
            } else if (text === '/info') {
                const foundUser = await UserModel.findOne({ where: { chatId: String(chatId) } });
                console.log(foundUser);

                return bot.sendMessage(
                    chatId,
                    `Hello ${message.from.first_name}, you have ${foundUser.right} right answers and ${foundUser.wrong} wrong answers`
                );
            } else if (text === '/game') {
                return startGame(chatId);
            } else {
                return bot.sendMessage(chatId, `Sorry, I don't understand this message`);
            }
        } catch (error) {
            console.log(error);
            return bot.sendMessage(chatId, 'There was an error, please try again later');
        }
    });

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const foundUser = await UserModel.findOne({ where: { chatId: String(chatId) } });

        if (data == chats[chatId]) {
            foundUser.right += 1;
            await bot.sendMessage(
                chatId,
                `Congratulations, you won, you guessed a number ${chats[chatId]}`,
                options.restartOptions
            );
        } else if (data === '/again') {
            return startGame(chatId);
        } else {
            foundUser.wrong += 1;
            await bot.sendMessage(
                chatId,
                `Unfortunately you lost, bot wished ${chats[chatId]}`,
                options.restartOptions
            );
        }
        await foundUser.save();
    });
};

start();
