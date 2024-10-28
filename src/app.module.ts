import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { UserModule } from './modules/users/user.module';
import { RoleModule } from './modules/roles/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './common/guards/jwt-auth-guard';
import { AdminModule } from './modules/admin/admin.module';
import { ProductModule } from './modules/products/product.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { CategoryModule } from './modules/category/category.module';
import { RedisModule } from './cache/redis.module';
import * as redisStore from 'cache-manager-ioredis'; // Không cần sửa
import { ProductSubscriber } from './modules/products/product.subscriber';
import { CartModule } from './modules/cart/cart.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PaymentMethodModule } from './modules/payment-method/payment.module';

@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '12052002',
        database: 'vebo',
        synchronize: true,
        autoLoadEntities: true,
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/migrations',
        },
        subscribers: [ProductSubscriber],
      }),
    }),
    ProductModule,
    CategoryModule,
    AdminModule,
    UserModule,
    RoleModule,
    AuthModule,
    CartModule,
    CartItemModule,
    OrderModule,
    OrderItemModule,
    PaymentModule,
    PaymentMethodModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtAuthGuard],
})
export class AppModule {}
