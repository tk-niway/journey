import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 5000,
});

// orvalのmutator用の関数
export const apiMutator = async <T = any, D = any>(
  config: AxiosRequestConfig
): Promise<AxiosResponse<T, D>> => {
  return apiClient.request<T, AxiosResponse<T, D>, D>(config);
};