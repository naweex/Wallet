import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
  TypeOrmModule.forRoot(TypeOrmConfig()) ,
  UserModule,
  WalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
