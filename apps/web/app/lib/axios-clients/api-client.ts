import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 5000,
});

// リクエストインターセプター: Authorizationヘッダーを自動追加
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // クライアントサイドでのみlocalStorageにアクセス
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
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
