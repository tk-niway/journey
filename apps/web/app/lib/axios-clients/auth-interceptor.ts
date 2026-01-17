import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getStorageItem, STORAGE_KEYS } from '@lib/storage/local-storage';

/**
 * Authorizationヘッダーを付与するインターセプターを追加する
 */
export const attachAuthInterceptor = (client: AxiosInstance): AxiosInstance => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return client;
};
