import { AxiosRequestConfig } from "axios";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      isProfileCompleted: boolean;
    };
  }
}

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
