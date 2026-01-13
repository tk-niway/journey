import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getStorageItem, STORAGE_KEYS } from '@lib/storage/local-storage';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 5000,
});

// リクエストインターセプター: Authorizationヘッダーを自動追加
apiClient.interceptors.request.use(
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

// orvalのmutator用の関数
export const apiMutator = async <T = any, D = any>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T, D>> => {
  return apiClient.request<T, AxiosResponse<T, D>, D>(config);
};
