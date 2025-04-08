"use client";

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import LevelIndicator from '../gamification/LevelIndicator';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const navigation = [
  { name: 'Concours', href: '/roadmaps', current: false },
  { name: 'Team', href: '/team', current: false },
  { name: 'Contact', href: '/contact-us', current: false }
]

function classNames(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Nav() {
  const { data: session } = useSession();

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 right-0 flex items-center lg:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-blue-800 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
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
                      item.current ? 'bg-blue-800 text-white' : 'text-gray-700 hover:bg-blue-800 hover:text-white'
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 lg:static lg:inset-auto lg:ml-6 lg:pl-0">
            {/* Level Indicator - Always visible */}
            <div className="mr-4">
              <LevelIndicator />
            </div>
            
            {/* Notification Button - Always visible */}
            

            {/* Auth Buttons */}
            <div className="ml-4">
              {session ? (
                <Menu as="div" className="relative">
                  <MenuButton className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={session.user?.image || "/images/default-avatar.png"}
                      alt=""
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <MenuItem>
                      {({ active }) => (
                        <a
                          href="/dashboard"
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Dashboard
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => signOut()}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block w-full text-left px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Sign out
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              ) : (
                <button
                  onClick={() => signIn('google')}
                  className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Image
                    src="/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  Sign in
                </button>
              )}
            </div>
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
                item.current ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
          
          {/* Level Indicator for Mobile - Always visible */}
          <div className="px-3 py-3 border-t border-blue-800 mt-2">
            <LevelIndicator />
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
