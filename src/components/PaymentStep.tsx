
import { useFormContext } from "react-hook-form";
import type { CheckoutValues } from "../schemas/checkout";
import { TextField } from "./ui/TextField";

export function PaymentStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutValues>();

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Payment details
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter test card details for this demo checkout.
        </p>
      </div>

      <TextField
        label="Card number"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="4242 4242 4242 4242"
        {...register("payment.cardNumber", {
          setValueAs: (value: string) => value.replace(/\s/g, ""),
        })}
        error={errors.payment?.cardNumber?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Expiry (MM/YY)"
          autoComplete="cc-exp"
          placeholder="12/30"
          {...register("payment.expiry")}
          error={errors.payment?.expiry?.message}
        />

        <TextField
          label="Security code"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="123"
          {...register("payment.cvc")}
          error={errors.payment?.cvc?.message}
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          {...register("payment.saveCard")}
          className="size-4 accent-violet-700"
        />
        Save card for future checkout
      </label>
    </div>
  );
}
