"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import FormInput from "@/components/FormInput";
import FormSelect from "../../_components/FormSelect";
import { useAction } from "@/hooks/useAction";
import { createUser } from "@/actions/create-user";
import { toast } from "sonner";

interface ProfileFormData {
  username: string;
  name: string;
  email: string;
  contact?: string;
  bio?: string;
  avatar?: string;
  gender?: "male" | "female" | "other";
  role: "fan" | "player" | "admin";
  availability: "available" | "injured" | "on_break";
  dob: Date;
  address?: {
    city: string;
    state: string;
    country: string;
  };
}

const selectGenderData = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Others", value: "others" },
];

const selectRoleData = [
  { label: "Fan", value: "fan" },
  { label: "Player", value: "player" },
  { label: "Admin", value: "admin" },
];

const ProfileForm = ({ update }: { update?: boolean }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      availability: "available",
      gender: "male",
      role: "fan",
    },
  });

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

  const onSubmit: SubmitHandler<ProfileFormData> = (formData) => {
    execute(formData).catch((err) => console.error(err));
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 font-sans">
      <div className="container-bg w-full max-w-4xl rounded-2xl border p-8 shadow-2xl backdrop-blur-sm md:p-12">
        <h1 className="mb-2 font-[cal_sans] text-3xl md:text-4xl">Complete Your Profile</h1>
        <p className="text-foreground mb-8 font-[poppins]">Provide information below.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="flex flex-col gap-6">
              <FormInput<ProfileFormData>
                register={register}
                errors={errors}
                name="username"
                label="Username"
                id="username"
                rules={{
                  required: "Username is required",
                  maxLength: { value: 15, message: "Username cannot exceed 15 characters" },
                }}
                placeholder="Create a username"
              />
              <FormInput<ProfileFormData>
                register={register}
                errors={errors}
                name="name"
                label="Full Name"
                id="name"
                rules={{
                  required: "Name is required",
                  maxLength: { value: 50, message: "Name cannot exceed 50 characters" },
                }}
                placeholder="Enter your full name"
              />
              <FormSelect<ProfileFormData>
                register={register}
                name="gender"
                label="Gender"
                data={selectGenderData}
                placeholder="Select your gender"
                rules={{ required: "Gender is required!" }}
              />
              <FormSelect<ProfileFormData>
                register={register}
                name="role"
                label="Select Role (Optional)"
                data={selectRoleData}
                placeholder="Select your role"
                rules={{ required: false }}
              />
            </div>
            <div className="flex flex-col gap-6">
              <FormInput<ProfileFormData>
                register={register}
                errors={errors}
                name="email"
                type="email"
                label="Email Address"
                id="email"
                rules={{
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
                }}
                placeholder="you@example.com"
              />
              <FormInput<ProfileFormData>
                register={register}
                errors={errors}
                name="contact"
                type="tel"
                label="Contact Number (Optional)"
                id="contact"
                rules={{
                  pattern: { value: /^[0-9+-]*$/, message: "Invalid phone number" },
                }}
                placeholder="Enter your phone number"
              />
              <FormInput<ProfileFormData>
                register={register}
                errors={errors}
                type="date"
                name="dob"
                label="Date of Birth"
                id="dob"
                rules={{ required: "Date of birth is required" }}
              />
            </div>
          </div>

          <div className="center mt-4 flex w-full">
            <Button type="submit" className="mx-auto w-full max-w-72" disabled={isLoading}>
              {isLoading ? <Spinner /> : <>Submit</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
