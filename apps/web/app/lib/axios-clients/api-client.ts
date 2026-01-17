import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { createApiClient } from './api-instance';
import { attachAuthInterceptor } from './auth-interceptor';
import { resolveApiBaseUrl } from './api-base-url';

const apiBaseUrl = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const apiClient = attachAuthInterceptor(
  createApiClient(apiBaseUrl, 5000)
);

// orvalのmutator用の関数
export const apiMutator = async <T = any, D = any>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T, D>> => {
  return apiClient.request<T, AxiosResponse<T, D>, D>(config);
};
