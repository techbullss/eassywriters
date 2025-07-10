// components/profile/PasswordForm.tsx
'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function PasswordForm({
  onPasswordChange
}: {
  onPasswordChange: (newPassword: string) => void;
}) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }
    
    if (newPassword.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters', type: 'error' });
      return;
    }

    onPasswordChange(newPassword);
    setMessage({ text: 'Password changed successfully', type: 'success' });
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md"
        >
          <Check size={18} /> Update Password
        </button>
        <button
          onClick={() => {
            setNewPassword('');
            setConfirmPassword('');
            setMessage(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          <X size={18} /> Cancel
        </button>
      </div>
    </div>
  );
}