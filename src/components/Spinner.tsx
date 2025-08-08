import { LoaderCircle } from "lucide-react";
import React from "react";

const Spinner = () => {
  return (
    <div className="repeat-infinite animate-spin">
      <LoaderCircle />
    </div>
  );
};

export default Spinner;
