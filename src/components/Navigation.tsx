"use client";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserIcon, ArrowRightOnRectangleIcon, LanguageIcon } from '@heroicons/react/24/outline'
import { SignInButton } from '@/components/Sign-in-button'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl';
import Link from 'next/link'
import { handleSignOut } from '@/lib/supabase/actions';
import { useRouter } from 'next/navigation';
import { Switch } from './Switch';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Concours', href: '/roadmap', current: true },
  { name: 'Équipe', href: '/team', current: false },
  { name: 'Contact', href: '/contact-us', current: false }
]

function classNames(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Nav() {

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [currentLang, setCurrentLang] = useState(locale);
  const { user, isAuthenticated, isLoading } = useAuth();

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];

  const switchLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    const segments = pathname.split('/');
    segments[1] = langCode; // replace locale segment
    const newPath = segments.join('/');
    router.push(newPath);
  };


  return (
    <Disclosure as="nav" className="border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50 bg-white dark:bg-gray-900">
      <div className="mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile logo - centered */}
          <div className="flex w-full items-center justify-between lg:hidden">
            <Link
              onMouseEnter={() => router.prefetch('/')}
              href="/"
              className="flex items-center"
            >
              <img
                alt="katuripu"
                src="/images/logo.png"
                className="h-6 w-auto dark:filter dark:brightness-90"
              />
            </Link>
            <div className="flex items-center">
              {/* Language Switcher */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-1 rounded-md py-1.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-700 dark:text-gray-300">
                  <LanguageIcon className="h-5 w-5" />
                  <span className="sr-only md:not-sr-only">{currentLang.toUpperCase()}</span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-10">
                    {languages.map((lang) => (
                      <Menu.Item key={lang.code}>
                        {({ active }) => (
                          <button
                            onClick={() => switchLanguage(lang.code)}
                            className={classNames(
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              currentLang === lang.code ? 'font-medium' : '',
                              'flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 text-left'
                            )}
                          >
                            {lang.name}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            <div className='mx-2'>
              <Switch />
            </div>  
              {isLoading ? (
                // Show skeleton loader while auth state is loading
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                </div>
              ) : isAuthenticated ? (
                <Menu as="div" className="relative mr-2">
                  <Menu.Button className="flex items-center hover:opacity-80 transition-opacity">
                    <img
                      src={user?.user_metadata?.avatar_url}
                      alt="User Avatar"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-10">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={classNames(
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                            )}
                          >
                            <UserIcon className="w-4 h-4 mr-2" />
                            Profil
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={classNames(
                              active ? 'bg-gray-100 dark:bg-gray-700' : '',
                              'flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                            )}
                          >
                            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                            Déconnexion
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <div className="mr-2">
                  <SignInButton />
                </div>
              )}

              <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-hidden focus:ring-inset">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:flex lg:flex-1 lg:items-stretch lg:justify-start">
            <div className="flex shrink-0 items-center">
              <Link
                onMouseEnter={() => router.prefetch('/')}
                href="/" className="flex items-center">
                <img
                  alt="katuripu"
                  src="/images/logo.png"
                  className="h-8 w-auto dark:filter dark:brightness-90"
                />
              </Link>
            </div>
            <div className="lg:ml-14">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onMouseEnter={() => router.prefetch(item.href)}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop right side actions */}
          <div className="hidden w-fit lg:items-center lg:justify-end lg:flex">
            {/* Language Switcher */}
            <Menu as="div" className="relative mr-4">
              <Menu.Button className="flex items-center space-x-1 rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                <LanguageIcon className="h-5 w-5 mr-1" />
                <span>{currentLang.toUpperCase()}</span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-10">
                  {languages.map((lang) => (
                    <Menu.Item key={lang.code}>
                      {({ active }) => (
                        <button
                          onClick={() => switchLanguage(lang.code)}
                          className={classNames(
                            active ? 'bg-gray-100 dark:bg-gray-700' : '',
                            currentLang === lang.code ? 'font-medium' : '',
                            'flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 text-left'
                          )}
                        >
                          {lang.name}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
            <div className="relative hidden lg:flex lg:items-center lg:justify-end lg:flex-1 mr-4 ">
              <Switch />
            </div>
            {isLoading ? (
              // Show skeleton loader while auth state is loading
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                  <img
                    src={user?.user_metadata?.avatar_url}
                    alt="User Avatar"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-10">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={classNames(
                            active ? 'bg-gray-100 dark:bg-gray-700' : '',
                            'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                          )}
                        >
                          <UserIcon className="w-4 h-4 mr-2" />
                          Profil
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleSignOut}
                          className={classNames(
                            active ? 'bg-gray-100 dark:bg-gray-700' : '',
                            'flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                          )}
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                          Déconnexion
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="lg:hidden">
        <div className="space-y-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 shadow-inner">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              className="block rounded-md px-3 py-3 text-base font-medium transition-colors duration-200 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white"
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
