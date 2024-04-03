import Cookies from 'js-cookie';
import { Get, Post } from './request';
import { COOKIE_NAME, LoginData, LoginResponse, SetupData, User, standaloneRoutes } from './types';

export const getUserInfo = (disableErrorNotification?: boolean) => {
  return Get<User>('/user/me', { disableErrorNotification });
}

export const setup = (setupData: SetupData) => {
  return Post<boolean>('/setup', setupData);
}

export const login = (loginData: LoginData) => {
  return Post<LoginResponse>('/user/login', loginData);
}


export const setAccessToken = (token: string) => {
  Cookies.set(COOKIE_NAME, token, {
    expires: 7,
  });
}

export const logout = () => {
  Cookies.remove(COOKIE_NAME);
  window.location.href = '/dash/login';
}

export const isStandaloneRoute = (pathname: string) => {
  return standaloneRoutes.includes(pathname);
}
