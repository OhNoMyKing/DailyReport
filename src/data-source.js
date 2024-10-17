"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
var typeorm_1 = require("typeorm");
var dotenv = require("dotenv");
dotenv.config();
console.log('Username:', process.env.USERNAME);
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.HOST,
    port: parseInt(process.env.PORT, 10),
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.NAME,
    entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/migrations/*{.ts,.js}'],
    synchronize: true,
    logging: true,
});
