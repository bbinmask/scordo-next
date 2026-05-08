import { AxiosRequestConfig } from "axios";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type AxiosProps = (
  url: string,
  method?: HttpMethod,
  body?: unknown,
  options?: AxiosRequestConfig
) => Promise<ApiResponse>;

export interface ApiResponse<T = unknown> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
