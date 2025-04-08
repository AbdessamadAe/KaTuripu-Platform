"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/client/Nav';
import UserProfile from '@/components/gamification/UserProfile';

const ProfilePage: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <UserProfile />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage; 