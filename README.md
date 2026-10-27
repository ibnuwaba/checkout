# Checkout Form

A responsive, multi-step checkout application built with React, TypeScript, React Hook Form, Zod, and Tailwind CSS. The project demonstrates structured form management, schema-based validation, accessible error messages, and simulated checkout responses.

## Features

- **Three-step checkout:** Account, Address, and Payment.
- **Schema validation:** Zod validates nested form data and displays field-level errors.
- **Form state management:** React Hook Form manages input values, validation, and submission.
- **Password confirmation:** Checks that both password fields match.
- **Address handling:** Updates the postal-code label based on the selected country.
- **Payment validation:** Includes Luhn card-number validation, future expiry validation, and CVC validation.
- **Accessible inputs:** Labels, generated input IDs, and accessible validation messages.
- **Persistent step navigation:** Moving backward preserves previously entered values.
- **Simulated API responses:** Demonstrates email-already-registered, declined-payment, and successful-checkout scenarios.
- **Responsive layout:** Designed for desktop and mobile screens.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Hook Form
- Zod
- `@hookform/resolvers`

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/YOUR_USERNAME/checkout.git
cd checkout
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the local URL shown in your terminal.

### Available Commands

```bash
pnpm dev
pnpm build
pnpm lint
```

Run the commands supported by the scripts in `package.json`.

## Form Validation

The checkout form uses a shared Zod schema organized into three sections:

- **AccountSchema:** Validates the user's name, email, password, and password confirmation.
- **AddressSchema:** Validates the street, city, country, and postal code.
- **PaymentSchema:** Validates the card number, expiry date, CVC, and save-card preference.

These schemas are combined into `CheckoutSchema`. The `CheckoutValues` TypeScript type is inferred from the combined schema, helping keep the form data and validation rules consistent.

React Hook Form uses `zodResolver` to connect the schema to the form. The `trigger()` method validates the current step before allowing the user to continue.

## Checkout Flow

1. **Account:** Enter account details and confirm the password.
2. **Address:** Enter the delivery address and select a country.
3. **Payment:** Enter test payment details and submit the checkout.
4. **Result:** The simulated API returns a success response or displays an appropriate error.

## Testing

Test the main scenarios using sample data:

| Scenario | Expected result |
|---|---|
| Invalid email | Email validation message |
| Passwords do not match | Confirmation error |
| Missing address fields | Required-field errors |
| Invalid card number | Card validation error |
| `taken@example.com` | Returns to Account with an email error |
| Test card `4000000000000002` | Displays a simulated declined-payment message |
| Valid sample data | Displays success and resets the form |

For a successful test, use the test card number `4242 4242 4242 4242`, a future expiry date, and a valid test CVC. Do not enter real payment details.

## Screenshots

- **Account step:** `screenshots/account.png`
- **Address step:** `screenshots/address.png`
- **Payment step:** `screenshots/payment.png`


## Project Structure

```text
src/
├── components/
│   ├── ui/
│   │   └── TextField.tsx
│   ├── AccountStep.tsx
│   ├── AddressStep.tsx
│   ├── PaymentStep.tsx
│   └── Checkout.tsx
├── lib/
│   └── utils.ts
├── schemas/
│   └── checkout.ts
├── App.tsx
└── main.tsx
```

## Security Note

This is an educational demonstration. Checkout responses are simulated locally; no real payment is processed. Do not use real card details or treat this demo as a production payment system.

## Learning Outcomes

This project demonstrates how to combine React Hook Form and Zod, manage a multi-step form with shared state, validate nested data, create reusable accessible fields, and handle simulated server-side errors.

## Deployment

**Live Demo:** Add your Vercel URL after deployment.

**GitHub Repository:** `https://github.com/ibnuwaba/checkout`

---

Built as part of the Shi’era Developers Mentorship Program — AI-Powered Full Stack Development.
