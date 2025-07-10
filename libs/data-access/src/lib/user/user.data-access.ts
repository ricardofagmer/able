import { ServerResourceService } from "../services/resource.service";
import { UserDto } from '@able/common';

class UserDataAccess extends ServerResourceService<UserDto, UserDto, UserDto> {
    constructor() {
        super('user');
    }


    async checkUserExists(email: string): Promise<any> {
        return this.customEndpoint('POST', 'check-exists', { email });
    }

}

export const userDataAccess = new UserDataAccess();

