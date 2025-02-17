import { WalletEntity } from "src/modules/wallet/entity/wallet.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id : number;
    @Column()
    fullname : string;
    @Column()
    mobile : string;
    @Column({type : 'numeric' , default : 0})//numeric can save float number like 1.25.
    balance : number;//the user's money on account call balance. 
    @CreateDateColumn()
    created_at : Date;
    @OneToMany(() => WalletEntity , wallet => wallet.user)//one user can have many wallets.
    transactions : WalletEntity[];
}