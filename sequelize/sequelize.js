import { Sequelize } from 'sequelize';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '../config.js';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
});

export { sequelize };
