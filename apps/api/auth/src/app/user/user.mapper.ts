import { Injectable } from '@nestjs/common';
import { UserDto } from '@able/common';
import {User} from "@able/api-shared";


@Injectable()
export class UserMapper {

    async entityToDto(entity: User): Promise<UserDto> {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            password: entity.password,
            permissions: entity.permissions as any,
        };
    }

    async entitiesToDTOs(input: User[]): Promise<UserDto[]> {
        return Promise.all(input.map(next => this.entityToDto(next)));
    }

}
