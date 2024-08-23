import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
    username: 'postgres',
    database: 'tg_bot',
    dialect: 'postgres',
    password: 'password',
    host: 'localhost',
    logging: false,
});
