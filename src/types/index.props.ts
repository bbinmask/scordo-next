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

export interface BreadcrumbLinkProps {
  href: string;
  name: string;
}

export type SearchCategory = "all" | "teams" | "matches" | "users" | "tournaments";

/** Shared shape for every item in the Explore results list */
export interface ExploreResult {
  id: string;
  type: SearchCategory;
  title: string;
  subtitle: string;
  meta: string;
  href: string;
}

export interface ExploreTeamResult extends ExploreResult {
  short: string;
  image: string | null;
  trending: boolean;
}

export interface ExploreMatchResult extends ExploreResult {
  status: string;
  badge?: string | null;
}

export interface ExploreUserResult extends ExploreResult {
  image: string | null;
}

export interface ExploreTournamentResult extends ExploreResult {
  badge?: string;
}

export interface ExploreResultsProps {
  teams: ExploreTeamResult[];
  matches: ExploreMatchResult[];
  users: ExploreUserResult[];
  tournaments: ExploreTournamentResult[];
}

export type IImageType = "logo" | "banner" | "avatar";

export interface BreadcrumbLinkProps {
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
