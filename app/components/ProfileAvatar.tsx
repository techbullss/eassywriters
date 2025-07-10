// components/profile/ProfileAvatar.tsx
'use client';

import { Camera } from 'lucide-react';
import { useRef } from 'react';

export default function ProfileAvatar({
  avatar,
  name,
  onAvatarChange
}: {
  avatar: string;
  name: string;
  onAvatarChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      // Upload logic here
      const imageUrl = URL.createObjectURL(file);
      onAvatarChange(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group w-32 h-32">
        {avatar ? (
          <img 
            src={avatar} 
            alt="Profile" 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl text-gray-500">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all"
        >
          <Camera size={18} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      <h2 className="mt-4 text-xl font-semibold">{name}</h2>
    </div>
  );
}