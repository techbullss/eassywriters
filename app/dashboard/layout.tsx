import Link from 'next/link';
import { ReactNode } from 'react';
import {
  User,
  ListOrdered,
  MessageCircle,
  Wallet,
  Users,
  BarChart2,
  LogOut
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { getUserFromToken } from '../api/read-token/route';
import { Toaster } from 'react-hot-toast';

const navItems = [
  { name: "My Profile", path: "/dashboard/profile", icon: User },
  { name: "Order List", path: "/dashboard/orderlist", icon: ListOrdered },
  { name: "Messages", path: "/dashboard/Chat", icon: MessageCircle },
  { name: "Wallet", path: "/dashboard/Wallet", icon: Wallet },
  { name: "Clients", path: "/dashboard/clients", icon: Users },
  { name: "Finance", path: "/dashboard/finance", icon: BarChart2 },
  { name: "Log Out", path: "/dashboard/logout", icon: LogOut },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
   const user = await getUserFromToken();

  if (!user) {
    redirect("/Loging");
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-5 space-y-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6"><Link href="/dashboard">Dashboard</Link></h2>
        <nav className="space-y-2">
          {navItems.map(({ name, path, icon: Icon }) => (
            <Link
              key={path}
              href={path}
              className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded hover:bg-indigo-100 hover:text-indigo-600 font-medium transition-all"
            >
              <Icon size={18} />
              {name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8"> <Toaster position="top-center" />{children}</main>
    </div>
  );
}
