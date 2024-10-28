import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { PaymentMethod } from "./payment-method.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PaymentMethodService{
    constructor(
        @InjectRepository(PaymentMethod)
        private readonly paymentMethodRepository : Repository<PaymentMethod>
    ){}
    async findPaymentMethodById(id : number) : Promise<PaymentMethod>{
        return this.paymentMethodRepository.findOne({
            where: {id}
        })
    }
}