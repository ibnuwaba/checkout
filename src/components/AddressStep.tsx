
import { useFormContext, Controller, useWatch } from "react-hook-form";
import type { CheckoutValues } from "../schemas/checkout";
import { TextField } from "./ui/TextField";

const countries = [
  { value: "ET", label: "Ethiopia" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
];

export function AddressStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CheckoutValues>();

  const country = useWatch({
    control,
    name: "address.country",
  });

  const postalLabel =
    country === "US" || country === "CA"
      ? "ZIP / Postal code"
      : country === "GB"
        ? "Postcode"
        : "Postal code";

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Shipping address
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Where should your order be delivered?
        </p>
      </div>

      <TextField
        label="Street address"
        autoComplete="street-address"
        {...register("address.street")}
        error={errors.address?.street?.message}
      />

      <TextField
        label="City"
        autoComplete="address-level2"
        {...register("address.city")}
        error={errors.address?.city?.message}
      />

      <div className="grid gap-1.5">
        <label
          htmlFor="country"
          className="text-sm font-medium text-slate-800"
        >
          Country
        </label>

        <Controller
          control={control}
          name="address.country"
          render={({ field }) => (
            <select
              {...field}
              id="country"
              autoComplete="country"
              aria-invalid={Boolean(errors.address?.country)}
              aria-describedby={
                errors.address?.country ? "country-error" : undefined
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-200"
            >
              <option value="">Select a country</option>
              {countries.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          )}
        />

        {errors.address?.country?.message && (
          <p id="country-error" role="alert" className="text-sm text-red-600">
            {errors.address.country.message}
          </p>
        )}
      </div>

      <TextField
        label={postalLabel}
        autoComplete="postal-code"
        {...register("address.postalCode")}
        error={errors.address?.postalCode?.message}
      />
    </div>
  );
}
