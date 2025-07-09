export interface CloudProviderProfile {
  provider: 'aws' | 'gcloud' | 'azure';
  id: string;
  email: string;
  name: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface CloudAuthConfig {
  clientId: string;
  clientSecret: string;
  region?: string;
  projectId?: string;
  tenantId?: string;
}