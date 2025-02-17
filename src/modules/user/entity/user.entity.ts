import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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

}