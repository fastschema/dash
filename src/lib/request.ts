import Cookies from 'js-cookie';
import { API_BASE_URI, COOKIE_NAME } from './types';
import { setNetworkError } from './event-bus';
import { notify } from './notify';

export type RequestHeaders = Record<string, string>;

export interface RequestOptions {
  headers?: RequestHeaders;
  disableErrorNotification?: boolean;
}

export type ResponseError = {
  code?: string;
  message: string;
  detail?: string;
};

export type Result<T = any> = {
  error?: ResponseError | string;
  data?: T;
} | T;

export interface RequestData {
  [key: string]: any;
};
const getRequestHeader = (headers?: RequestHeaders, data?: any): RequestHeaders => {
  const accessToken = Cookies.get(COOKIE_NAME);
  const requestHeaders: {
    [key: string]: string;
  } = {
    'Content-Type': 'application/json;charset=utf-8',
    ...(headers ?? {}),
  };

  if (data instanceof FormData) {
    delete requestHeaders['Content-Type'];
  }

  if (accessToken) {
    requestHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  return requestHeaders;
};

const getErrorMessage = (error: ResponseError | string, defaultMessage = '') => {
  if (typeof error === 'string') {
    return error;
  }

  return error.message ?? defaultMessage;
}

export const createRequest = async <T>(
  method: string,
  url: string,
  data?: any,
  options?: RequestOptions,
): Promise<T | Response>  => {
  let response: Response | null = null;
  const requestInit: RequestInit = {
    method: method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: getRequestHeader(options?.headers ?? {}, data),
    redirect: 'follow',
    referrerPolicy: 'strict-origin-when-cross-origin',
  };

  if (data) {
    if (data instanceof FormData) {
      requestInit.body = data;
    } else {
      requestInit.body = JSON.stringify(data);
    }
  }

  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = API_BASE_URI + url;
    }

    response = await fetch(url, requestInit);

    if (!response.ok) {
      let errorMessage = response.statusText ?? 'Network response was not ok';
      try {
        const errorResponse = await response.json();
        errorMessage = getErrorMessage(errorResponse.error, errorMessage);
      } catch (e) { }

      throw new Error(errorMessage);
    }

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      const result: Result<T> = await response.json();

      if ((result as { error: ResponseError }).error) {
        throw new Error(
          getErrorMessage((result as { error: ResponseError }).error)
        );
      }

      return (result as { data: T }).data ?? (result as T);
    } else {
      return response;
    }
  } catch (e: any) {
    console.error(e);
    let errorMessage = '';

    if (!options?.disableErrorNotification) {
      notify.error(getErrorMessage(e.message, 'An error occurred. Please try again later.'));
    }

    if (e instanceof Error) {
      errorMessage = e.message;
    }

    const networkError = errorMessage.includes('Failed to fetch');
    networkError && setNetworkError('An error occurred. Please try again later.');

    throw new Error(errorMessage);
  }
};

export const isNetworkError = (error: Error) => {
  return error.message.includes('Failed to fetch');
};

export const isAuthError = (error: Error) => {
  const message = (error.message ?? '').toLocaleLowerCase();
  return message.includes('401') || message.includes('unauthorized');
};

export const Get = async <T>(
  url: string,
  options?: RequestOptions,
): Promise<T> => {
  const response = await createRequest('GET', url, null, options);
  return response as T;
};

export const Post = async <T>(
  url: string,
  data?: any,
  options?: RequestOptions,
): Promise<T> => {
  const response = await createRequest('POST', url, data, options);
  return response as T;
};

export const Put = async <T>(
  url: string,
  data?: any,
  options?: RequestOptions,
): Promise<T> => {
  const response = await createRequest('PUT', url, data, options);
  return response as T;
};

export const Delete = async <T>(
  url: string,
  data?: any,
  options?: RequestOptions,
): Promise<T> => {
  const response = await createRequest('DELETE', url, data, options);
  return response as T;
};
