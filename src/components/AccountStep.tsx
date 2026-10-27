
import { useFormContext } from "react-hook-form";
import type { CheckoutValues } from "../schemas/checkout";
import { TextField } from "./ui/TextField";

export function AccountStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutValues>();

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter your details to continue checkout.
        </p>
      </div>

      <TextField
        label="Full name"
        autoComplete="name"
        {...register("account.name")}
        error={errors.account?.name?.message}
      />

      <TextField
        label="Email address"
        type="email"
        autoComplete="email"
        {...register("account.email")}
        error={errors.account?.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        hint="Use at least 8 characters."
        {...register("account.password")}
        error={errors.account?.password?.message}
      />

      <TextField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        {...register("account.confirmPassword")}
        error={errors.account?.confirmPassword?.message}
      />
    </div>
  );
}
