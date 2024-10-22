import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  //Thiết lập swagger
  const options  = new DocumentBuilder()
    .setTitle('api-project')
    .setDescription('hello')
    .setVersion('1.0')
    .build();
  const documnet = SwaggerModule.createDocument(app,options);
  SwaggerModule.setup('/',app,documnet);
  
  await app.listen(3000);
}
bootstrap();
