import { ServerResourceService } from '../services/resource.service';

class EndpointDataAccess extends ServerResourceService<any, any, any> {
    constructor() {
        super('endpoint');
    }


    async confirmResetPassword(payload: any): Promise<any> {
        return this.customEndpoint('POST', `confirm-reset-password`, payload);
    }

}

export const endpointDataAccess = new EndpointDataAccess();


