export const environment = {
    production: process.env.NODE_ENV === 'production',
    apiUrl: process.env.NODE_ENV === 'production' ? 'https://app.able.com.br/api' : 'http://localhost:3000/api',
    defaultLanguage: 'ptBr',
};
