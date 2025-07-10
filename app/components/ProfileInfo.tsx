// components/profile/ProfileInfo.tsx
'use client';

import { useState } from "react";

interface User {
  name: string;
  email: string;
  role: string;
}

interface ProfileInfoProps {
  user: User;
  onUpdate: (updatedUser: { name: string }) => void;
}

export default function ProfileInfo({ user, onUpdate }: ProfileInfoProps) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user.name);

  const handleSave = () => {
    onUpdate({ name });
    setEditMode(false);
  };

  return (
    <div className="space-y-4">
      {editMode ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setName(user.name);
                setEditMode(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="text-lg">{user.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-lg">{user.email}</p>
          </div>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
}