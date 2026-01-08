"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "@/hooks/useAction";
import { updateUserDetails } from "@/actions/user-actions";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";

import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/generated/prisma";
import { UpdateUserDetails } from "@/actions/user-actions/schema";
import { useDetailsModal } from "@/hooks/store/use-profile";

interface UserDetailsFormProps {
  user: User;
}

const UserDetailsForm = ({ user }: UserDetailsFormProps) => {
  const form = useForm<z.infer<typeof UpdateUserDetails>>({
    resolver: zodResolver(UpdateUserDetails),
    defaultValues: {
      username: user.username,
      name: user.name,
      bio: user.bio,
      dob: user.dob,
      gender: user.gender,
      contact: user.contact || "",
    },
  });

  const { onClose } = useDetailsModal();

  function onSubmit(values: z.infer<typeof UpdateUserDetails>) {
    execute(values);
  }

  const { execute, isLoading } = useAction(updateUserDetails, {
    onSuccess: (data) => {
      toast.success("Updated successfully!");
      onClose();
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 overflow-y-auto">
        {/* Username */}

        {/* Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={String(field.value)}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            {/* <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Contact */}
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Phone number"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value instanceof Date ? field.value.toISOString().split("T")[0] : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Availability */}
            {/* <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Availability</FormLabel>
                  <Select
                    value={field.value === undefined ? undefined : String(field.value)}
                    onValueChange={(value) => field.onChange(value === "true")}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="true">Available</SelectItem>
                      <SelectItem value="false">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
        </div>

        {/* BIo */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block">Bio</FormLabel>
              <FormControl>
                <Textarea maxLength={50} {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex justify-center">
          <Button type="submit" className="w-full max-w-xs cursor-pointer" disabled={isLoading}>
            {isLoading ? <Spinner /> : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserDetailsForm;
