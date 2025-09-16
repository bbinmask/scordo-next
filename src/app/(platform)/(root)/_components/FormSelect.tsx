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
import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface FormSelectProps<T extends Record<string, any>> {
  data: { label: string; value: string; id?: string }[];
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
      <SelectTrigger className="w-full">
        <SelectValue className="font-semibold" placeholder={placeholder || "Select"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="font-semibold">{label}</SelectLabel>
          <SelectItem value="No">No</SelectItem>
          {data.length === 0 ? (
            <SelectItem value={"null"}>N/A</SelectItem>
          ) : (
            data.map((item, i) => (
              <SelectItem key={i} value={item.value}>
                {item.label}
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FormSelect;
