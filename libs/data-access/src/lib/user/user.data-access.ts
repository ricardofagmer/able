import { ServerResourceService } from "../services/resource.service";
import { ConfirmAccountDto, ResendConfirmationEmailDto, UserDto } from '@able/common';

class UserDataAccess extends ServerResourceService<UserDto, UserDto, UserDto> {
    constructor() {
        super('user');
    }

    async getCurrentUser(): Promise<UserDto> {
        return this.customEndpoint<UserDto>('GET', 'me');
    }

    async updateProfile(data: UserDto): Promise<UserDto> {
        return this.customEndpoint<UserDto>('PATCH', 'profile', data);
    }

    async changePassword(oldPassword: string, newPassword: string) {
        return this.customEndpoint('POST', 'change-password', {
            oldPassword,
            newPassword,
        });
    }

    async confirmAccount(request: ConfirmAccountDto): Promise<boolean> {
        return this.customEndpoint('POST', 'confirm-account',  request);
    }

    async resendConfirmationEmail(payload: ResendConfirmationEmailDto): Promise<any> {
        return this.customEndpoint('POST', `resend-confirmation-email`, payload);
    }

    async checkUserExists(email: string): Promise<any> {
        return this.customEndpoint('POST', 'check-exists', { email });
    }

}

export const userDataAccess = new UserDataAccess();

