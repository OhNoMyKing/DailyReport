import { Body, Controller, Post } from "@nestjs/common";
import { RabbitMQService } from "src/rabbitmq/rabbitmq.service";
@Controller('chatbot')
export class ChatbotController{
    constructor(private readonly rabbitMQService : RabbitMQService){}
    @Post('question')
    async sendMessageToRasa(@Body() body :{message : string}){
        const exchage = 'chatbot_exchange';
        const routingKey = 'message_to_rasa';
        const message = {text : body.message};
        await this.rabbitMQService.sendMessageToExchange(exchage,routingKey,message);
        return {status : 'Message sent to Rasa', message};
    }
}