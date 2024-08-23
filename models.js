import { DataTypes } from 'sequelize';
import { sequelize } from './db.js';

export const UserModel = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
    chatId: { type: DataTypes.STRING, unique: true },
    right: { type: DataTypes.INTEGER, defaultValue: 0 },
    wrong: { type: DataTypes.INTEGER, defaultValue: 0 },
});
