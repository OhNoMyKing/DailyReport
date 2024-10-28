import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./payment.entity";
import { OrderModule } from "../order/order.module";
import { PaymentService } from "./payment.service";
import { PaymentMethodModule } from "../payment-method/payment.module";
import { PaymentGateWay } from "./payment.gateway";
import { UserModule } from "../users/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Payment]),
        OrderModule,
        PaymentMethodModule,
        UserModule
    ],
    providers: [PaymentService,PaymentGateWay]
})
export class PaymentModule{

}