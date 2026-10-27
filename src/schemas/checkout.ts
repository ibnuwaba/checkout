
import { z } from "zod";

// 1. Account validation
export const AccountSchema = z
  .object({
    name: z.string().trim().min(2, {
      error: "Name must contain at least 2 characters",
    }),
    email: z.email({
      error: "Enter a valid email address",
    }),
    password: z.string().min(8, {
      error: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string().min(1, {
      error: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

// 2. Address validation
export const AddressSchema = z.object({
  street: z.string().trim().min(3, {
    error: "Enter your street address",
  }),
  city: z.string().trim().min(2, {
    error: "Enter your city",
  }),
  country: z.string().min(1, {
    error: "Select your country",
  }),
  postalCode: z.string().trim().min(3, {
    error: "Enter a valid postal code",
  }).max(12, {
    error: "Postal code is too long",
  }),
});

// Helper: validate a card number using the Luhn algorithm
export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, "");

  if (!/^\d{13,19}$/.test(digits)) {
    return false;
  }

  let sum = 0;
  let doubleDigit = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);

    if (doubleDigit) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    doubleDigit = !doubleDigit;
  }

  return sum % 10 === 0;
}

// Helper: expiry must be MM/YY and not expired
export function isFutureExpiry(expiry: string): boolean {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry);

  if (!match) {
    return false;
  }

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();

  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return (
    year > currentYear ||
    (year === currentYear && month >= currentMonth)
  );
}

// 3. Payment validation
export const PaymentSchema = z.object({
  cardNumber: z
    .string()
    .refine(isValidLuhn, {
      error: "Enter a valid card number",
    }),
  expiry: z.string().refine(isFutureExpiry, {
    error: "Enter a valid future expiry date (MM/YY)",
  }),
  cvc: z.string().regex(/^\d{3,4}$/, {
    error: "Security code must contain 3 or 4 digits",
  }),
  saveCard: z.boolean(),
});

// 4. Combine the three steps
export const CheckoutSchema = z.object({
  account: AccountSchema,
  address: AddressSchema,
  payment: PaymentSchema,
});

// 5. Infer the TypeScript type from the schema
export type CheckoutValues = z.infer<typeof CheckoutSchema>;
