import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
dotenv.config();
console.log('Username:', process.env.USERNAME);
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.HOST,
    port: parseInt(process.env.PORT,10),
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.NAME,
    entities: [__dirname+'/modules/**/*.entity{.ts,.js}'],
    migrations: [__dirname+'/migrations/migrations/*{.ts,.js}'],
    synchronize: true,
    logging: true,
});