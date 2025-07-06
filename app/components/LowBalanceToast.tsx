"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LowBalanceToast({ toastId }: { toastId: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <span className="mb-2">Your wallet balance is too low.</span>
      <button
        onClick={() => {
          router.push("/dashboard/Wallet");
          toast.dismiss(toastId);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
      >
        Top Up Now
      </button>
    </div>
  );
}
