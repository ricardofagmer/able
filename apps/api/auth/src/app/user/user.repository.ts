import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from "@able/api-shared";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(request: User): Promise<User> {
        const user = this.userRepository.create(request);

        return this.userRepository.save(user);
    }

    async updateUser(id: number, request: User): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });

        return this.userRepository.save({ ...user, ...request });
    }

    async findById(id: any): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async findByName(name: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { name } });
    }

    async findAll(): Promise<User[] | null> {
        return this.userRepository.find();
    }
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }
}
