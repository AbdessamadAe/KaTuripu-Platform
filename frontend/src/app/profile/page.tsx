"use client";

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { Disclosure } from '@headlessui/react';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserData(user as unknown as UserData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-16">
            <div className="animate-pulse h-32 w-32 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Not Logged In</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Please log in to view your profile.</p>
              </div>
              <div className="mt-5">
                <a
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-color hover:bg-custom-btn-bg-hover-color focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color"
                >
                  Go to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <a 
            href="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Home
          </a>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and account information.</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row">
              <div className="sm:w-1/3 flex justify-center mb-6 sm:mb-0">
                <div className="relative">
                  <img 
                    src={userData.user_metadata.avatar_url || '/default-avatar.png'} 
                    alt="Profile" 
                    className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg" 
                  />
                </div>
              </div>
              <div className="sm:w-2/3">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData.user_metadata.full_name || userData.user_metadata.name || 'Not provided'}</dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{userData.email || userData.user_metadata.email || 'Not provided'}</dd>
                  </div>
                  
                  {userData.user_metadata.user_name && (
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Username</dt>
                      <dd className="mt-1 text-sm text-gray-900">{userData.user_metadata.user_name}</dd>
                    </div>
                  )}
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Account created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(userData.created_at).toLocaleDateString()}
                    </dd>
                  </div>
                  
                  {userData.user_metadata.provider && (
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Login provider</dt>
                      <dd className="mt-1 text-sm text-gray-900 capitalize">{userData.user_metadata.provider}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="px-4 py-5 sm:px-6 w-full flex justify-between items-center text-left">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Activity</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Your recent activity and progress.</p>
                  </div>
                  <span className={`ml-6 h-7 flex items-center ${open ? 'transform rotate-180' : ''}`}>
                    <svg className="h-6 w-6 transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 py-5 sm:px-6 border-t border-gray-200">
                  <div className="text-center py-10">
                    <p className="text-gray-500">Activity data will be shown here.</p>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  );
}