import axios from "axios";
import { baseURL } from "@/constants/urls";

export const AxiosRequest = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default AxiosRequest;
