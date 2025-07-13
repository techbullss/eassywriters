

import { redirect } from "next/navigation";
import Link from "next/link";
import CurrentOrder from "../components/CurrentOrder";
import { getUserFromToken } from "../api/read-token/route";
import FilterOrder from "../components/FilterOrder";

export default async function DashboardHome() {
  const user = await getUserFromToken();
    
  if (!user) redirect("/Loging");

      // const walletRes = await fetch(`http://localhost:8080/api/balance?email=${user.sub}`);
const walletRes = await fetch(`http://localhost:8080/api/balance?email=${user.sub}`, {
      method: 'GET', // Explicitly set GET (optional but clear)
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if needed:
        // 'Authorization': `Bearer ${user.token}`
      },
      cache: 'no-store' // Important for Next.js to avoid stale data
    });
console.log("Fetching wallet balance for user:", user.sub);
let balance = 0;

if (walletRes.ok) {
  try {
    const data = await walletRes.json();
    balance = typeof data === "number" ? data : 0;
  } catch (err) {
    console.error("Failed to parse wallet response:", err);
  }
} else {
  console.error("Wallet API responded with", walletRes.status);
}


  return (
    <div className="text-gray-800">
      <div className="flex items-center  gap-2 flex-row">
        <div>
      <p className="mb-0">Wallet Balance: <span className="font-semibold text-green-600">${balance.toFixed(2)}</span></p>
 <Link href="dashboard/Wallet">
      <button className="
        relative
        px-2 py-3
        bg-emerald-500 hover:bg-emerald-600
        rounded-lg
        shadow-md hover:shadow-lg
        transition-all duration-200
        group
        overflow-hidden
      ">
        <span className="
          font-semibold 
          text-white
          group-hover:text-emerald-100
          transition-colors duration-200
          relative z-10
        ">
          Top Up Wallet
        </span>
        
        {/* Animated background effect */}
        <span className="
          absolute inset-0
          bg-gradient-to-r from-emerald-400 to-emerald-600
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        "></span>
        
        {/* Pulse animation on hover */}
        <span className="
          absolute top-0 left-0
          w-full h-full
          border-2 border-emerald-300
          rounded-lg
          opacity-0 group-hover:opacity-100
          group-hover:animate-ping
          pointer-events-none
        "></span>
      </button>
    </Link>  
        </div>
      
    <div><FilterOrder /></div>
    
       </div>
    <div><CurrentOrder walletBalance={balance} emails={user.sub}/></div>
    </div>
  );
}
