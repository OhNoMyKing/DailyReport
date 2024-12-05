import { Injectable, OnModuleInit } from "@nestjs/common";
import { RabbitMQService } from "src/rabbitmq/rabbitmq.service";
@Injectable()
export class ChatbotListener implements OnModuleInit {
    constructor(private readonly rabbitMQService : RabbitMQService){}
    async onModuleInit() {
        const queue = 'rasa_response_queue'; //ten queue nhan phan hoi tu rasa
        await this.rabbitMQService.consumeQueue(queue, (message) =>{
            //xu ly phan hoi tu rasa
            console.log(message);
        });
    }
}