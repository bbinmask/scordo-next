"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actionOK } from "@/actions/action-ok";
import { useAction } from "@/hooks/useAction";
import { z } from "zod";
import { createUser } from "@/actions/create-user";

const userSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
});
type UserFormData = z.infer<typeof userSchema>;

export default function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const { execute, isLoading, error } = useAction(createUser, {
    onSuccess: () => {},
  });

  const onSubmit = async (data: UserFormData) => {
    await execute(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label>Name</label>
        <input {...register("name")} className="w-full border p-2" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input {...register("email")} className="w-full border p-2" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        {isLoading ? "Saving..." : "Save"}
      </button>

      {error && <p className="text-red-600">Something went wrong.</p>}
      {/* {result?.success && <p className="text-green-600">User created: {result.user.name}</p>} */}
    </form>
  );
}
