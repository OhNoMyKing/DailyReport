import { Body, Controller } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create.payment.dto";
import { PaymentService } from "./payment.service";

@Controller('payments')
export class PaymentController{
    constructor(
        private readonly paymentService : PaymentService
    ){}
    async createPayment(@Body() paymentDto : CreatePaymentDto){
        this.paymentService.processPayment(paymentDto);
    }   
}