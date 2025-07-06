// components/PaypalTopUp.tsx
"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";

export default function PaypalTopUp() {
  const [amount, setAmount] = useState("10.00"); // default value

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border mb-8">
      <div className="flex items-center gap-3 mb-4">
        <img
          src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
          alt="PayPal"
          className="w-8 h-8"
        />
        <h3 className="text-xl font-semibold text-gray-800">
          Top up with PayPal
        </h3>
      </div>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount (USD)"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
      />

     <div className="relative z-10 mt-8">
  <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
  <PayPalButtons
    style={{ layout: "vertical" }}
    createOrder={(data, actions) => {
      return actions.order.create({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              value: amount,
              currency_code: "USD",
            },
          },
        ],
      });
    }}
    onApprove={async (data, actions) => {
      const details = await actions.order!.capture();
      const payer = details.payer;

      await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          txId: details.id,
          payerEmail: payer?.email_address,
        }),
      });

      alert("Top-up successful!");
    }}
    onCancel={(data) => {
      console.log("Payment cancelled:", data);
      alert("You cancelled the payment.");
    }}
    onError={(err) => {
      console.error("Payment error:", err);
      alert("Payment failed. Please check your balance or try again.");
    }}
  />
</PayPalScriptProvider>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          By clicking "Pay with PayPal", you agree to our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>.
        </p>
</div>

    </div>
  );
}
