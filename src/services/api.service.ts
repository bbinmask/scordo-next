import axios from "axios";
import { baseURL } from "@/constants/urls";
import type { ApiResponse, HttpMethod } from "@/types/api.props";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
}

export const apiFetch = async <T = unknown>(
  url: string,
  method: HttpMethod = "GET",
  body?: unknown
): Promise<ApiResponse<T>> => {
  try {
    const res = await apiClient.request<ApiResponse<T>>({
      url,
      method,
      data: body,
    });
    return res.data;
  } catch (err: any) {
    return (
      err?.response?.data ?? {
        status: 500,
        success: false,
        message: "Network error",
        error: String(err),
      }
    );
  }
};
