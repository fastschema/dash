export * from './content';
export * from './schema';
export * from './ui';
export * from './app';

export const API_BASE_URI = process.env.NEXT_PUBLIC_API_BASE_URI;
export const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME ?? 'token';
export const standaloneRoutes = ['/login', '/register', '/activate', '/setup'];
