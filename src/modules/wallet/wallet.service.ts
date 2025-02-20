import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entity/wallet.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { DepositDto, WithdrawDto } from './wallet.dto';
import { UserEntity } from '../user/entity/user.entity';
import { WalletEnum } from './wallet.enum';
import { ProductList } from '../products';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
    private userService: UserService,
    private dataSource: DataSource //data source for using query runner.
  ) {}

  async deposit(depositDto: DepositDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const { amount, fullname, mobile } = depositDto;
        const user = await this.userService.createUser({ mobile, fullname });
        const userData = await queryRunner.manager.findOneBy(UserEntity, {id: user.id});
        if(!userData) throw new NotFoundException()
        const newBalance = userData?.balance + amount;
        await queryRunner.manager.update(UserEntity, {id: user.id}, {balance: newBalance});
        await queryRunner.manager.insert(WalletEntity, {
            amount,
            type: WalletEnum.Deposit,
            invoice_number: Date.now().toString(),
            userId: user.id
        });
        //commit
        await queryRunner.commitTransaction();
        await queryRunner.release();
    } catch (error) {
        //rollback
        console.log(error);
        await queryRunner.rollbackTransaction();
        await queryRunner.release()
    }
    return {
        message: "payment successfully Done"
    }
}
async paymentByWallet(withdrawDto: WithdrawDto) {
    const {productId, userId} = withdrawDto;
    const product = ProductList.find(product => product.id === productId);
    if(!product) throw new NotFoundException("not found product");
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const user = await queryRunner.manager.findOneBy(UserEntity, {id: userId});
        if(!user) throw new NotFoundException("user not found");
        if(product.price > user.balance) {
            throw new BadRequestException("user balance is not enough");
        }
        const newBalance = user.balance - product.price;
        await queryRunner.manager.update(UserEntity, {id: userId}, {balance: newBalance});
        await queryRunner.manager.insert(WalletEntity, {
            amount: product.price,
            userId,
            reason: "buy product " + product.name,
            productId,
            invoice_number: Date.now().toString(),
            type: WalletEnum.Withdraw
        });
        //commit
        await queryRunner.commitTransaction();
        await queryRunner.release();
    } catch (error) {
        //rollback
        await queryRunner.rollbackTransaction();
        await queryRunner.release()
        if(error?.statusCode) {
            throw new HttpException(error.message, error?.statusCode)
        }
        throw new BadRequestException(error?.message)
    }
    return {
        message: "payment order successfully Done"
    }
}
}
