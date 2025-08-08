import React from "react";

const NotFoundParagraph = ({ description }: { description?: string }) => {
  return (
    <p className="py-10 text-center text-lg text-gray-500 dark:text-gray-400">
      {description || "Nothing to show here!"}
    </p>
  );
};

export default NotFoundParagraph;
