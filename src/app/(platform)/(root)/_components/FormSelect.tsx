import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import React from "react";
import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";

interface FormSelectProps<T extends Record<string, any>> {
  data: { label: string; value: string }[];
  label: string;
  name: string;
  className?: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  rules: RegisterOptions;
}

const FormSelect = <T extends Record<string, any>>({
  data,
  name,
  label,
  placeholder,
  register,
  rules,
  className,
}: FormSelectProps<T>) => {
  return (
    <Select {...register(name as any, rules as any)}>
      <SelectTrigger className="w-[90%]">
        <SelectValue className="font-semibold" placeholder={placeholder || "Select"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="font-semibold">{label}</SelectLabel>
          {data.map((item, i) => (
            <SelectItem key={i} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FormSelect;
