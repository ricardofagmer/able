import { ServerResourceService } from '../services/resource.service';

class EndpointDataAccess extends ServerResourceService<any, any, any> {
    constructor() {
        super('endpoint');
    }
}

export const endpointDataAccess = new EndpointDataAccess();


