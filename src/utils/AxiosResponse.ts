import axios from "axios";
import { baseURL } from "@/constants";

export const AxiosRequest = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export function setAuthToken(token: string) {
  if (token) {
    AxiosRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete AxiosRequest.defaults.headers.common["Authorization"];
  }
}

export default AxiosRequest;
