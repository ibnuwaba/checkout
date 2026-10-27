
import { useState } from "react";
import {
  FormProvider,
  useForm,
  type FieldPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CheckoutSchema,
  type CheckoutValues,
} from "../schemas/checkout";
import { AccountStep } from "./AccountStep";
import { AddressStep } from "./AddressStep";
import { PaymentStep } from "./PaymentStep";

const defaultValues: CheckoutValues = {
  account: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  address: {
    street: "",
    city: "",
    country: "",
    postalCode: "",
  },
  payment: {
    cardNumber: "",
    expiry: "",
    cvc: "",
    saveCard: false,
  },
};

const steps: {
  label: string;
  key: FieldPath<CheckoutValues>[];
}[] = [
  {
    label: "Account",
    key: [
      "account.name",
      "account.email",
      "account.password",
      "account.confirmPassword",
    ],
  },
  {
    label: "Address",
    key: [
      "address.street",
      "address.city",
      "address.country",
      "address.postalCode",
    ],
  },
  {
    label: "Payment",
    key: [
      "payment.cardNumber",
      "payment.expiry",
      "payment.cvc",
      "payment.saveCard",
    ],
  },
];

type ApiResult =
  | { status: "success" }
  | { status: "email_taken" }
  | { status: "declined" };

async function simulateCheckoutApi(
  values: CheckoutValues,
): Promise<ApiResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (values.account.email.toLowerCase() === "taken@example.com") {
    return { status: "email_taken" };
  }

  if (values.payment.cardNumber === "4000000000000002") {
    return { status: "declined" };
  }

  return { status: "success" };
}

export function Checkout() {
  const [stepIndex, setStepIndex] = useState(0);

  const methods = useForm<CheckoutValues>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues,
    mode: "onTouched",
  });

  const {
    trigger,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const goNext = async () => {
    clearErrors("root.server");

    const valid = await trigger(steps[stepIndex].key, {
      shouldFocus: true,
    });

    if (valid && stepIndex < steps.length - 1) {
      setStepIndex((current) => current + 1);
    }
  };

  const goBack = () => {
    clearErrors("root.server");
    setStepIndex((current) => Math.max(0, current - 1));
  };

  const onSubmit = async (values: CheckoutValues) => {
    console.log("Checkout payload:", values);

    clearErrors("root.server");

    const result = await simulateCheckoutApi(values);

    if (result.status === "email_taken") {
      setError("account.email", {
        type: "server",
        message: "This email is already registered.",
      });
      setStepIndex(0);
      return;
    }

    if (result.status === "declined") {
      setError("root.server", {
        type: "server",
        message:
          "The test payment was declined. Please try another test card.",
      });
      setStepIndex(2);
      return;
    }

    reset(defaultValues);
    setStepIndex(0);
    window.alert("Checkout completed successfully!");
  };

  return (
    <FormProvider {...methods}>
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-xl">
          <header className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-700">
              Demo checkout
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Complete your order
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Step {stepIndex + 1} of {steps.length}
            </p>
          </header>

          <ol
            aria-label="Checkout progress"
            className="mb-8 grid grid-cols-3 gap-3"
          >
            {steps.map((step, index) => (
              <li key={step.label}>
                <div
                  aria-current={
                    index === stepIndex ? "step" : undefined
                  }
                  className={`rounded-lg border-b-4 px-2 py-3 text-center text-sm font-medium ${
                    index === stepIndex
                      ? "border-violet-700 bg-violet-50 text-violet-800"
                      : index < stepIndex
                        ? "border-emerald-500 bg-white text-slate-700"
                        : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  <span className="block text-xs">Step {index + 1}</span>
                  {step.label}
                </div>
              </li>
            ))}
          </ol>

          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                stepIndex < steps.length - 1 &&
                event.target instanceof HTMLElement &&
                ["INPUT", "SELECT"].includes(event.target.tagName)
              ) {
                event.preventDefault();
                void goNext();
              }
            }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
          >
            {stepIndex === 0 && <AccountStep />}
            {stepIndex === 1 && <AddressStep />}
            {stepIndex === 2 && <PaymentStep />}

            {errors.root?.server?.message && (
              <p
                role="alert"
                className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {errors.root.server.message}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={goBack}
                disabled={stepIndex === 0 || isSubmitting}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>

              {stepIndex < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => void goNext()}
                  className="rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Processing..." : "Complete checkout"}
                </button>
              )}
            </div>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Practice project only. Use test data; no payment is processed.
          </p>
        </div>
      </main>
    </FormProvider>
  );
}
