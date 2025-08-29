"use client";

import { createUser } from "@/actions/create-user";
import { useAction } from "@/hooks/useAction";
import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

const page = () => {
  const { execute, isLoading, fieldErrors } = useAction(createUser, {
    onSuccess: (data) => {
      console.log("Successful");
      toast.success(`${data.name}, Your account is successfully created.`);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err);
    },
  });

  const onSubmit = (formData: any) => {
    const data: any = {};

    execute(data);
  };
  return (
    <div>
      <form action={onSubmit}>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default page;
