"use client";

import { Disclosure } from '@headlessui/react';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface UserMetadata {
  avatar_url?: string;
  email?: string;
  full_name?: string;
  name?: string;
  user_name?: string;
  provider?: string;
}

interface UserData {
  id: string;
  email?: string;
  user_metadata: UserMetadata;
  created_at: string;
}

export default function ProfilePage() {
  const { isSignedIn, user, isLoaded } = useUser();

  return ((
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <a
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Home
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">User Profile</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Personal details and account information.</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row">
                <div className="sm:w-1/3 flex justify-center mb-6 sm:mb-0">
                  <div className="relative">
                    <img
                      src={user?.imageUrl || '/default-avatar.png'}
                      alt="Profile"
                      className="h-48 w-48 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                  </div>
                </div>
                <div className="sm:w-2/3">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{user?.user_metadata?.full_name || user?.user_metadata?.name || 'Not provided'}</dd>
                    </div>

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{'Not provided'}</dd>
                    </div>

                    {user?.firstName && (
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">{user.fullName}</dd>
                      </div>
                    )}

                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Account created</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}