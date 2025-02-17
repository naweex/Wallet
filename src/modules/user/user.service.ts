import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository : Repository<UserEntity>
    ){}

    async findById(id : number){
        const user = await this.userRepository.findOneBy({id})
        if(!user) throw new NotFoundException()
            return user;
    }
}
