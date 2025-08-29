import { FieldErrors, UseFormRegister, RegisterOptions } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface FormInputProps<T extends Record<string, any>>
  extends Omit<React.ComponentProps<"input">, "name"> {
  name: keyof T & string; // field name from form schema, forced to string
  label?: string; // optional label
  register: UseFormRegister<T>; // register from RHF
  errors: FieldErrors<T>; // errors from RHF
  rules: RegisterOptions;
}

const FormInput = <T extends Record<string, any>>({
  name,
  label,
  register,
  errors,
  id,
  rules,
  className,
  ...inputProps
}: FormInputProps<T>) => {
  return (
    <div className="mb-1">
      {label && (
        <Label
          htmlFor={id || String(name)}
          className="text-foreground mb-1 block text-base font-semibold"
        >
          {label}
        </Label>
      )}

      <Input
        id={id || String(name)}
        {...register(name as any, rules as any)}
        className={className}
        {...inputProps} // spread other props (placeholder, type, etc.)
      />

      {errors[name] && <p className="mt-1 text-sm text-red-600">{String(errors[name]?.message)}</p>}
    </div>
  );
};

export default FormInput;
