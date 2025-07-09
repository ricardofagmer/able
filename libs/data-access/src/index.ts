// Server-side exports
export * from './lib/services/resource.service';
export * from './lib/user/user.data-access';
export * from './lib/endpoint/endpoint.data-access';
export * from './lib/auth/auth.data-access';
export * from './lib/permission/permission.data-access';
export * from './lib/environment.prod';
export * from './lib/types';
export * from './lib/hooks/use-resource';

// Client-side exports
export { getClientApiClient } from './lib/client-api-client';

