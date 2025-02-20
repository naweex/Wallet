import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { WalletEnum } from "../wallet.enum";
import { UserEntity } from "src/modules/user/entity/user.entity";

@Entity('wallet')
export class WalletEntity {
    @PrimaryGeneratedColumn('increment')
    id : number;
    @Column({type : 'enum' , enum : WalletEnum})
    type : string; //type of our transaction , it can be deposit or withdraw.
    @Column({type : 'numeric'})
    amount : number;
    @Column()
    invoice_number : string;
    @Column({nullable : true})
    reason : string;
    @Column({nullable : true})
    productId : number;
    @CreateDateColumn()
    created_at : Date;
    @Column()
    userId : number;                                        //in many payment projects we should use setNull instead cascade because shouldnt delete users transactions in banking app.
    @ManyToOne(() => UserEntity , user => user.transactions , {onDelete : 'CASCADE'}) //many wallets can belong to one person(user).
    user : UserEntity;
}