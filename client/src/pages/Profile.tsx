import React from 'react';
import { ProfileForm } from '../features/profile/ProfileForm.js';
import { useAuth } from '../hooks/useAuth.js';
import { authApi } from '../api/authApi.js';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const handleSaveProfile = async (updatedUser: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const response = await authApi.updateProfile(updatedUser);
    updateUser(response.user);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-left">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-black text-gray-900">
          {user.fullName}
        </h1>
      </div>

      <ProfileForm onSave={handleSaveProfile} />
    </div>
  );
};

  