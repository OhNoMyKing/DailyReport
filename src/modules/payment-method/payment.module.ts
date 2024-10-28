import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeORMError } from "typeorm";
import { PaymentMethod } from "./payment-method.entity";
import { PaymentMethodService } from "./payment-method.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentMethod])
    ],
    providers: [PaymentMethodService],
    exports: [PaymentMethodService]
})
export class  PaymentMethodModule{

}