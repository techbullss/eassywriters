// app/dashboard/profile/page.tsx

import { getUserFromToken } from '@/app/api/read-token/route';
import ProfilePage from '@/app/components/ProfilePage';
import { redirect } from 'next/navigation';


export default async function ProfilePages() {
  const user = await getUserFromToken();
  if (!user) redirect('/login');
  
  return (
    <ProfilePage user={{
      id: user.sub,
      name: user.name || '',
      email: user.email || '',
      avatar: user.avatar || '',
      role: user.role
    }} />
  );
}