import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { ProductModule } from "../products/product.module";
import { AdminService } from "./admin.service";
import { ProductService } from "../products/product.service";

@Module({
    imports: [ProductModule],
    providers: [AdminService],
    controllers: [AdminController]
})
export class AdminModule{

}