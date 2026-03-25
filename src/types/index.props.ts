import { AxiosRequestConfig } from "axios";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      isProfileCompleted: boolean;
      id: string;
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

export interface ExploreResultsProps {
  teams: {
    id: string;
    type: "all" | "teams" | "matches" | "users" | "tournaments";
    title: string;
    short: string;
    subtitle: string;
    image: string | null;
    meta: string;
    href: string;
    trending: boolean;
  }[];
  matches: {
    id: string;
    type: "all" | "teams" | "matches" | "users" | "tournaments";
    title: string;
    subtitle: string;
    meta: string;
    href: string;
    status: string;
    badge?: string | null;
  }[];
  users: {
    id: string;
    type: "all" | "teams" | "matches" | "users" | "tournaments";
    title: string;
    subtitle: string;
    image: string | null;
    meta: string;
    href: string;
  }[];
  tournaments: {
    id: string;
    type: "all" | "teams" | "matches" | "users" | "tournaments";
    title: string;
    subtitle: string;
    meta: string;
    href: string;
    badge?: string;
  }[];
}

export type IImageType = "logo" | "banner" | "avatar";
