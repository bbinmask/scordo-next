import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

interface BaseProps {
  description?: string;
}

interface RedirectProps extends BaseProps {
  redirect: true;
  link: string;
  title: string;
}

interface NoRedirectProps extends BaseProps {
  redirect?: false;
  link?: never;
  title?: never;
}

type ParaProps = RedirectProps | NoRedirectProps;

const NotFoundParagraph = ({ description, redirect, link, title }: ParaProps) => {
  return (
    <div className="center flex flex-col gap-10 py-10">
      <p className="text-center text-lg text-gray-500 dark:text-gray-400">
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
