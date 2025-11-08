import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BaseProps {
  description?: string;
}

interface RedirectProps extends BaseProps {
  redirect: true;
  link: string;
  title: string;
  className?: string;
}

interface NoRedirectProps extends BaseProps {
  redirect?: false;
  link?: never;
  title?: never;
  className?: string;
}

type ParaProps = RedirectProps | NoRedirectProps;

const NotFoundParagraph = ({ className, description, redirect, link, title }: ParaProps) => {
  return (
    <div className="center flex flex-col gap-10 py-10 font-[poppins]">
      <p className={cn("text-center text-lg text-gray-500 dark:text-gray-400", className)}>
        {description || "Nothing to show here!"}
      </p>
      {redirect && (
        <Button
          type="button"
          className="primary-btn rounded-full px-10 py-6 font-[poppins] text-lg"
        >
          <Link href={link}>{title}</Link>
        </Button>
      )}
    </div>
  );
};

export default NotFoundParagraph;
