import axios, { type AxiosInstance } from 'axios';

/**
 * API通信用のAxiosインスタンスを生成する
 */
export const createApiClient = (
  baseURL: string,
  timeoutMs: number = 5000
): AxiosInstance => {
  return axios.create({ baseURL, timeout: timeoutMs });
};
