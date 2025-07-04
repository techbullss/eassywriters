// components/FlutterwaveTopUp.tsx
"use client";
import { useState } from "react";

export default function FlutterwaveTopUp() {
  const [amount, setAmount] = useState("");

  const handleFlutterwavePayment = () => {
  if (typeof window === "undefined" || !(window as any).FlutterwaveCheckout) {
    alert("Payment SDK not loaded. Try reloading the page.");
    return;
  }

  if (!amount) return alert("Enter amount");

  const email = localStorage.getItem("email") || "guest@example.com";

  (window as any).FlutterwaveCheckout({
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: Date.now().toString(),
    amount: parseFloat(amount),
    currency: "USD",
    payment_options: "card",
    customer: {
      email,
    },
    callback: function (response: any) {
      console.log("Payment success:", response);
      window.location.href = `/wallet/success?tx_ref=${response.tx_ref}`;
    },
    customizations: {
      title: "Top up Wallet",
      description: "Secure Card Payment",
      logo: "https://yourdomain.com/logo.png",
    },
  });
};


  return (
   <div className="bg-white rounded-2xl shadow-md p-6 border mb-8">
      <div className="flex items-center gap-3 mb-4">
        <img
          src="https://seeklogo.com/images/F/flutterwave-logo-2A13D7C3B8-seeklogo.com.png"
          alt="Flutterwave"
          className="w-8 h-8"
        />
        <h3 className="text-xl font-semibold text-gray-800">
          Top up with Card (Flutterwave)
        </h3>
      </div>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Enter Amount (USD)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleFlutterwavePayment}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}
