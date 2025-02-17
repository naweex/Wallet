import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('wallet')
export class WalletEntity {
    @PrimaryGeneratedColumn('increment')
    id : number;
    @CreateDateColumn()
    
}