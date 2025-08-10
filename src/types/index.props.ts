import { AxiosRequestConfig } from "axios";

export type AxiosProps = (
  url: string,
  method?: "GET" | "POST" | "PUT" | "DELETE",
  body?: any,
  options?: AxiosRequestConfig
) => Promise<any>;

export interface BreadScrumbLinkProps {
  href: string;
  name: string;
}
