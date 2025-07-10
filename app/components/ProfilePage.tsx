// components/profile/ProfilePage.tsx
'use client';

import { useState } from 'react';
import ProfileInfo from './ProfileInfo';
import ProfileAvatar from './ProfileAvatar';
import PasswordForm from './PasswordForm';

export default function ProfilePage({ user }: { user: {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [avatar, setAvatar] = useState(user.avatar);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <ProfileAvatar 
          avatar={avatar} 
          onAvatarChange={setAvatar} 
          name={user.name}
        />
        
        <div className="flex-1">
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-2 px-1 ${activeTab === 'profile' ? 'border-b-2 border-blue-500' : ''}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`pb-2 px-1 ${activeTab === 'password' ? 'border-b-2 border-blue-500' : ''}`}
            >
              Password
            </button>
          </div>

          {activeTab === 'profile' ? (
            <ProfileInfo 
              user={user} 
              onUpdate={(updatedUser) => {
                // Handle profile update
              }} 
            />
          ) : (
            <PasswordForm 
              onPasswordChange={(newPassword) => {
                // Handle password change
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
}