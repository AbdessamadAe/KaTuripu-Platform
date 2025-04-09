"use client";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { SignInButton } from '@/components/client/sing-in-button'
import supabase from '@/lib/supabase'
import { useEffect, useState } from 'react'

const navigation = [
  { name: 'Concours', href: '/roadmap', current: true },
  { name: 'Team', href: '/team', current: false },
]

function classNames(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Nav() {

  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session?.user);
      
      if (session?.user) {
        const { data: user } = await supabase.auth.getUser();
        setUser(user);
      }
    }

    fetchSession();
  }, []);

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 right-0 flex items-center lg:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-200 hover:text-black focus:ring-2 focus:ring-black focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center lg:items-stretch lg:justify-start">
            <div className="flex shrink-0 items-center">
              <a href="/" className="flex items-center">
                <img
                  alt="katuripu"
                  src="/images/logo.png"
                  className="h-8 w-auto"
                />
              </a>
            </div>
            <div className="hidden lg:ml-14 lg:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                      item.current ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 lg:static lg:inset-auto lg:ml-6 lg:pl-0">
            {/* Conditionally render the user's profile if logged in */}
            {session ? (
              <div className="flex items-center space-x-4">
                <img
                  src={user?.user?.user_metadata?.avatar_url || '/default-avatar.png'} // Fallback if no avatar is present
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full"
                />
                <span>{user?.user?.user_metadata?.full_name || 'User'}</span>
              </div>
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="lg:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-100 hover:text-black',
                'block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
