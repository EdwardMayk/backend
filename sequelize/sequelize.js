import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: '12345678',
    database: 'system',
    port: 3306,
});

export { sequelize };
