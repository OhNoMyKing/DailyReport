import { RabbitMQService } from "src/rabbitmq/rabbitmq.service";
import { ChatbotController } from "./chatbot.controller";
import { ChatbotListener } from "./chatbot.listener";
import { Module } from "@nestjs/common";
import { RabbitMQModule } from "src/rabbitmq/rabbitmq.module";

@Module({
    imports: [RabbitMQModule],
    controllers: [ChatbotController],
    providers : [ChatbotListener,RabbitMQService],
})
export class ChatbotModule{}