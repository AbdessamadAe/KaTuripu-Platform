"use client";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserIcon, ArrowRightOnRectangleIcon, LanguageIcon } from '@heroicons/react/24/outline'
import { SignInButton } from '@/components/client/sing-in-button'
import { useAuth } from '@/contexts/AuthContext'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl';
import Link from 'next/link'

const navigation = [
  { name: 'Concours', href: '/roadmap', current: true },
  { name: 'Équipe', href: '/team', current: false },
  { name: 'Contact', href: '/contact-us', current: false }
]

function classNames(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Nav() {
  console.log('Nav component rendering');
  
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [currentLang, setCurrentLang] = useState(locale);
  const [userProfile, setUserProfile] = useState<{ avatar: string; name: string } | null>(null);

  console.log({
    authState: {
      user: user,
      loading,
      isAuthenticated,
      userMetadata: user?.user_metadata
    },
    navigationState: {
      pathname,
      locale,
      currentLang
    },
    userProfile
  });

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];

  const handleSignOut = async () => {
    console.log('Signing out user...');
    await logout();
    console.log('User signed out');
  };

  const switchLanguage = (langCode: string) => {
    console.log(`Switching language from ${currentLang} to ${langCode}`);
    setCurrentLang(langCode);
    const segments = pathname.split('/');
    segments[1] = langCode; // replace locale segment
    const newPath = segments.join('/');
    console.log(`Navigating to new path: ${newPath}`);
    router.push(newPath);
  };

  useEffect(() => {
    console.log('userEffect triggered on user?.id change', { userId: user?.id });
    if (user) {
      console.log('User profile data:', {
        avatar: user?.user_metadata?.avatar_url,
        name: user?.user_metadata?.name
      });
    }
    setUserProfile({avatar: user?.user_metadata?.avatar_url, name: user?.user_metadata?.name});
  }, [user?.id]);

  console.log('Before render:', { 
    isAuthenticated, 
    userProfile,
    navigationItems: navigation
  });

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      {({ open }) => {
        console.log('Disclosure state:', { open });
        return (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                {/* Mobile logo - centered */}
                <div className="flex w-full items-center justify-between lg:hidden">
                  <Link 
                    onMouseEnter={() => {
                      console.log('Prefetching home route');
                      router.prefetch('/')
                    }}
                    href="/" 
                    className="flex items-center"
                  >
                    <img
                      alt="katuripu"
                      src="/images/logo.png"
                      className="h-6 w-auto"
                    />
                  </Link>
                  
                  <div className="flex items-center">
                    {/* Language Switcher */}
                    <Menu as="div" className="relative mr-2">
                      {({ open: menuOpen }) => {
                        console.log('Language menu state:', { menuOpen });
                        return (
                          <>
                            <Menu.Button className="flex items-center space-x-1 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-gray-100 transition-colors duration-200">
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
                              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                {languages.map((lang) => (
                                  <Menu.Item key={lang.code}>
                                    {({ active }) => (
                                      <button
                                        onClick={() => switchLanguage(lang.code)}
                                        className={classNames(
                                          active ? 'bg-gray-100' : '',
                                          currentLang === lang.code ? 'font-medium' : '',
                                          'flex w-full items-center px-4 py-2 text-sm text-gray-700 text-left'
                                        )}
                                      >
                                        {lang.name}
                                      </button>
                                    )}
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </>
                        );
                      }}
                    </Menu>
                    
                    {isAuthenticated && userProfile ? (
                      <Menu as="div" className="relative mr-2">
                        {({ open: profileMenuOpen }) => {
                          console.log('Profile menu state (mobile):', { profileMenuOpen });
                          return (
                            <>
                              <Menu.Button className="flex items-center hover:opacity-80 transition-opacity">
                                <img
                                  src={userProfile.avatar}
                                  alt="User Avatar"
                                  className="h-7 w-7 rounded-full object-cover"
                                  onError={(e) => {
                                    console.error('Avatar image failed to load', e);
                                    (e.target as HTMLImageElement).src = '/images/default-avatar.png';
                                  }}
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
                                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <Link
                                        href="/profile"
                                        className={classNames(
                                          active ? 'bg-gray-100' : '',
                                          'flex items-center px-4 py-2 text-sm text-gray-700'
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
                                          active ? 'bg-gray-100' : '',
                                          'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                                        )}
                                      >
                                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                                        Déconnexion
                                      </button>
                                    )}
                                  </Menu.Item>
                                </Menu.Items>
                              </Transition>
                            </>
                          );
                        }}
                      </Menu>
                    ) : (
                      <div className="mr-2">
                        <SignInButton />
                      </div>
                    )}
                    
                    <DisclosureButton 
                      onClick={() => console.log('Mobile menu button clicked')}
                      className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-200 hover:text-black focus:ring-2 focus:ring-black focus:outline-hidden focus:ring-inset"
                    >
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
                      onMouseEnter={() => {
                        console.log('Prefetching home route (desktop)');
                        router.prefetch('/')
                      }}
                      href="/" className="flex items-center">
                      <img
                        alt="katuripu"
                        src="/images/logo.png"
                        className="h-8 w-auto"
                        onError={(e) => console.error('Logo image failed to load', e)}
                      />
                    </Link>
                  </div>
                  <div className="lg:ml-14">
                    <div className="flex space-x-4">
                      {navigation.map((item) => {
                        console.log(`Rendering nav item: ${item.name}`);
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onMouseEnter={() => {
                              console.log(`Prefetching route: ${item.href}`);
                              router.prefetch(item.href);
                            }}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                              'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 hover:text-black'
                            )}
                          >
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Desktop right side actions */}
                <div className="hidden lg:flex lg:items-center lg:justify-end lg:flex-1">
                  {/* Language Switcher */}
                  <Menu as="div" className="relative mr-4">
                    {({ open: langMenuOpen }) => {
                      console.log('Language menu state (desktop):', { langMenuOpen });
                      return (
                        <>
                          <Menu.Button className="flex items-center space-x-1 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-gray-100 transition-colors duration-200">
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
                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                              {languages.map((lang) => (
                                <Menu.Item key={lang.code}>
                                  {({ active }) => (
                                    <button
                                      onClick={() => switchLanguage(lang.code)}
                                      className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        currentLang === lang.code ? 'font-medium' : '',
                                        'flex w-full items-center px-4 py-2 text-sm text-gray-700 text-left'
                                      )}
                                    >
                                      {lang.name}
                                    </button>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </>
                      );
                    }}
                  </Menu>
                  
                  {loading ? (
                    // Show skeleton loader while auth state is loading
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="hidden sm:block">
                        {console.log('Rendering skeleton loader')}
                      </div>
                    </div>
                  ) : isAuthenticated && userProfile ? (
                    <Menu as="div" className="relative">
                      {({ open: profileMenuOpen }) => {
                        console.log('Profile menu state (desktop):', { 
                          profileMenuOpen,
                          userProfile
                        });
                        return (
                          <>
                            <Menu.Button className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                              <img
                                src={userProfile.avatar}
                                alt="User Avatar"
                                className="h-8 w-8 rounded-full object-cover"
                                onError={(e) => {
                                  console.error('Avatar image failed to load in desktop view', e);
                                  (e.target as HTMLImageElement).src = '/images/default-avatar.png';
                                }}
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
                              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      href="/profile"
                                      className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'flex items-center px-4 py-2 text-sm text-gray-700'
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
                                        active ? 'bg-gray-100' : '',
                                        'flex w-full items-center px-4 py-2 text-sm text-gray-700'
                                      )}
                                    >
                                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                                      Déconnexion
                                    </button>
                                  )}
                                </Menu.Item>
                              </Menu.Items>
                            </Transition>
                          </>
                        );
                      }}
                    </Menu>
                  ) : (
                    <SignInButton />
                  )}
                </div>
              </div>
            </div>

            <DisclosurePanel className="lg:hidden">
              <div className="space-y-1 px-4 py-3 bg-gray-50 shadow-inner">
                {navigation.map((item) => {
                  console.log(`Rendering mobile nav item: ${item.name}`);
                  return (
                    <DisclosureButton
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block rounded-md px-3 py-3 text-base font-medium transition-colors duration-200 text-gray-800 hover:bg-gray-200 hover:text-black"
                      onClick={() => console.log(`Mobile menu item clicked: ${item.name}`)}
                    >
                      {item.name}
                    </DisclosureButton>
                  );
                })}
              </div>
            </DisclosurePanel>
          </>
        );
      }}
    </Disclosure>
  )
}
