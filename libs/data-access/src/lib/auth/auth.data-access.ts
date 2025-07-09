import { ServerResourceService } from '../services/resource.service';
import {
    ConfirmPasswordDto,
    LoginDto,
    LoginResponse,
    RefreshTokenDto,
    RefreshTokenResponse,
    ResetPasswordDto
} from '@able/common';


class AuthDataAccess extends ServerResourceService<LoginDto, LoginDto, LoginDto> {
    constructor() {
        super('auth');
    }

    async login(payload: LoginDto): Promise<LoginResponse> {
        return this.customEndpoint('POST', 'login', payload);
    }

    async refresh(payload: RefreshTokenDto): Promise<RefreshTokenResponse> {
        return this.customEndpoint('POST', 'refresh', payload);
    }

    async logout(payload: LoginDto): Promise<LoginDto> {
        return this.customEndpoint('POST', 'logout', payload);
    }

    async resetPassword(payload: ResetPasswordDto): Promise<any> {
        return this.customEndpoint('POST', 'reset-password', payload);
    }

    async confirmResetPassword(payload: ConfirmPasswordDto): Promise<any> {
        return this.customEndpoint('POST', `confirm-reset-password`, payload);
    }

}

export const authDataAccess = new AuthDataAccess();

