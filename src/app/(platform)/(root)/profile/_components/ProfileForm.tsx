import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BiSave } from "react-icons/bi";
import Spinner from "@/components/Spinner";
import UserProps from "@/types/user.props";
interface ProfileFormData {
  username: string;
  name: string;
  email: string;
  contact: string;
  bio?: string;
  avatar?: string;
  gender?: "male" | "female" | "others";
  role: "fan" | "player" | "admin";
  availability: "available" | "injured" | "on_break";
  dob?: Date;
  address?: {
    city: string;
    state: string;
    country: string;
  };
}

const UsernameError = ({ errorMessage }: { errorMessage: string }) => {
  return errorMessage ? (
    <p
      className={`text-sm ${errorMessage.includes("available") ? "text-green-600" : "text-red-600"}`}
    >
      {errorMessage}
    </p>
  ) : null;
};

const ProfileForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<ProfileFormData>({
    defaultValues: {
      availability: "available",
      gender: "male",
      role: "fan",
    },
  });

  const loading = false;

  const onSubmit: SubmitHandler<ProfileFormData> = async (formData) => {
    return;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="relative flex w-full flex-col items-center justify-center">
        <label htmlFor="username-input" className="sr-only">
          Username
        </label>
        <Input
          id="username"
          {...register("username", { required: "username is required" })}
          placeholder="Create a username"
          maxLength={15}
          className="text-lg md:col-span-3"
        />
        <div className="mt-1">
          <UsernameError errorMessage={"Something went wrong"} />
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-y-4 md:grid-cols-4 md:gap-x-4">
        <label htmlFor="fullname-input" className="text-lg font-medium md:col-span-1">
          Full Name
        </label>

        <Input
          id="fullname-input"
          {...register("name", { required: "Name is required" })}
          placeholder="Enter your name here"
          className="text-lg md:col-span-3"
        />
      </div>
      <hr className="border-gray-200" />
      <div className="grid grid-cols-1 items-center gap-y-4 md:grid-cols-4 md:gap-x-4">
        <label htmlFor="email-input" className="text-lg font-medium md:col-span-1">
          Email
        </label>

        <Input
          id="email-input"
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder="Enter your email here"
          className="text-lg md:col-span-3"
        />
      </div>
      <hr className="border-gray-200" />

      <div className="grid grid-cols-1 items-center gap-y-4 md:grid-cols-4 md:gap-x-4">
        <label htmlFor="phone-input" className="text-lg font-medium md:col-span-1">
          Phone
        </label>

        <Input
          id="phone-input"
          {...register("contact")}
          type="text"
          maxLength={15}
          minLength={10}
          placeholder="Enter contact no."
          className="text-lg md:col-span-3"
        />
      </div>

      <div className="">
        <div className="grid grid-cols-1 items-center gap-y-4 md:grid-cols-4 md:gap-x-4">
          <label htmlFor="city" className="text-lg font-medium md:col-span-1">
            City
          </label>
          <Input
            id="city"
            placeholder="Enter your city"
            {...register("address.city", { required: "City is required" })}
            className="text-lg md:col-span-3"
          />
          {errors.address?.city && (
            <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 items-center gap-y-4 md:grid-cols-4 md:gap-x-4">
          <label htmlFor="state" className="text-lg font-medium md:col-span-1">
            State
          </label>
          <Input
            {...register("address.state")}
            placeholder="Enter your state"
            className="text-lg md:col-span-3"
          />
          {errors.address?.state && (
            <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 items-center gap-y-4 md:grid-cols-4 md:gap-x-4">
          <label htmlFor="country" className="text-lg font-medium md:col-span-1">
            Country
          </label>
          <Input
            {...register("address.country", {
              required: "Country is required",
            })}
            placeholder="Enter your country"
            className="text-lg md:col-span-3"
          />
          {errors.address?.country && (
            <p className="mt-1 text-sm text-red-600">{errors.address.country.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          className="font-urbanist border-none bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 shadow-md hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <BiSave className="mr-1 text-xl" /> Save
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
