import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentGateWay{
    async processPayment(amount : number, paymentMethodId :number ) : Promise<{success : boolean}>{
        console.log(amount,paymentMethodId);
        return {success : true};
    }
}