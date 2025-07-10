
import { redirect, useRouter } from 'next/navigation';
import LoginForm from '../components/Loginform';
import { getUserFromToken } from '../api/read-token/route';

export default async function LoginPage() {
  const user = await getUserFromToken();
  if (user) {
    redirect("/dashboard"); 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <LoginForm />
    </div>
  );
}
