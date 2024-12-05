import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as amqp from 'amqplib';
@Injectable()
export class RabbitMQService implements OnModuleInit,OnModuleDestroy{
    private connection : amqp.Connection;
    private channel: amqp.Channel;

    //Thiet lap ket noi khi module duoc khoi tao
    async onModuleInit() {
        this.connection = await amqp.connect('amqp://guest:guest@172.24.136.124:5672');
        this.channel = await this.connection.createChannel();
        //tao exchange (neu chua co)
        console.log('RabbitMQ channel created:', this.channel);
        await this.createExchange('chatbot_exchange');
        //tao queue (neu chua co)
        const queue = 'rasa_queue';
        await this.channel.assertQueue(queue, {durable : true});
        //lien ket queue voi exchange
        await this.bindQueueToExchange(queue,'chatbot_exchange','message_to_rasa');
    }
    //Dong ket noi khi module bi huy
    async onModuleDestroy() {
        await this.channel.close();
        await this.connection.close();
    }
    //gui message len queue
    async sendMessage(queue : string, message : {text : string}){
        await this.channel.assertQueue(queue, {durable : true});
        this.channel.sendToQueue(queue,Buffer.from(JSON.stringify(message)),{
            persistent : true,
        });
        console.log(`Sent Message to Queue ${queue}:`, message);
    }
    //tao mot exchange
    async createExchange(exchange : string){
        await this.channel.assertExchange(exchange, 'direct', {durable : true});
        console.log(`Exchange ${exchange} created`);
    }
    //gui message toi exchange
    async sendMessageToExchange(exchange : string, routingKey: string, message : {text : string}){
        this.channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(message)),{
            persistent : true,
        });
        console.log(`Sent Message to exchange ${exchange} with routing key ${routingKey}: `,message);
    }
    //lien ket queue voi exchange
    async bindQueueToExchange(queue: string, exchange: string, routingKey : string){
        await this.channel.bindQueue(queue,exchange,routingKey);
        console.log(`Bound queue ${queue} to exchange ${exchange} with routing key ${routingKey}`);
    }
    //Nhan message tu queue
    async consumeQueue(queue: string, callback: (message: { text: string }) => void) {
        console.log('Current channel:', this.channel); // Log để kiểm tra kênh
        if (!this.channel) {
            console.error('Channel is undefined!'); // Kiểm tra nếu kênh là undefined
            return;
        }
        
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, (msg) => {
            if (msg) {
                callback(JSON.parse(msg.content.toString()));
                this.channel.ack(msg);
            }
        });
        console.log(`Waiting for messages in queue ${queue}`);
    }
    
}