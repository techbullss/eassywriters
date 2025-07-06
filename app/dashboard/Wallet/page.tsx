"use client"
import FlutterwaveTopUp from "@/app/components/FlutterwaveTopUp";
import PaypalTopUp from "@/app/components/PaypalTopUp";
export default function WalletPage() {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Top Up Your Wallet</h1>
      
      <PaypalTopUp />
    </div>
  );
}