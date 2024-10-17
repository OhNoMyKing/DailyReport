import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
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
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost', // Sửa đổi ở đây
        port: 5432,
        username: 'postgres', // Sửa đổi ở đây
        password: '12052002', // Sửa đổi ở đây
        database: 'vebo', // Sửa đổi ở đây
        synchronize: false,
        autoLoadEntities: true,
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/migrations',
        }
      }),
    }),
    ProductModule,
    CategoryModule,
    AdminModule,
    UserModule,
    RoleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,JwtAuthGuard],
})
export class AppModule {}
