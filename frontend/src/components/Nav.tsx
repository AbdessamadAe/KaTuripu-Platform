"use client";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, UserIcon, ArrowRightOnRectangleIcon, LanguageIcon } from '@heroicons/react/24/outline'
import { SignInButton } from '@/components/sing-in-button'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl';
import Link from 'next/link'
import createClientForBrowser from '@/lib/db/client';
import { handleSignOut } from '@/lib/db/actions';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

const Switch = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative">
      <label className="relative inline-flex items-center justify-center cursor-pointer text-[17px]" id="theme-toggle-button">
        <input 
          type="checkbox" 
          id="toggle"
          className="w-0 h-0 opacity-0" 
          checked={isDark}
          onChange={toggleTheme}
        />
        <svg 
          viewBox="0 0 69.667 44" 
          xmlnsXlink="http://www.w3.org/1999/xlink" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-14 my-auto"
        >
          <g transform="translate(3.5 3.5)" data-name="Component 15 – 1" id="Component_15_1">
            <g filter="url(#container)" transform="matrix(1, 0, 0, 1, -3.5, -3.5)">
              <rect 
                className="transition-all duration-250 ease-in-out" 
                fill="#83cbd8" 
                transform="translate(3.5 3.5)" 
                rx="17.5" 
                height={35} 
                width="60.667" 
                data-name="container" 
                id="container" 
              />
            </g>
            <g 
              className="transition-all duration-250 ease-in-out" 
              transform="translate(2.333 2.333)" 
              id="button"
            >
              <g className="transition-all duration-250 ease-in-out" data-name="sun" id="sun">
                <g filter="url(#sun-outer)" transform="matrix(1, 0, 0, 1, -5.83, -5.83)">
                  <circle fill="#f8e664" transform="translate(5.83 5.83)" r="15.167" cy="15.167" cx="15.167" data-name="sun-outer" id="sun-outer-2" />
                </g>
                <g filter="url(#sun)" transform="matrix(1, 0, 0, 1, -5.83, -5.83)">
                  <path fill="rgba(246,254,247,0.29)" transform="translate(9.33 9.33)" d="M11.667,0A11.667,11.667,0,1,1,0,11.667,11.667,11.667,0,0,1,11.667,0Z" data-name="sun" id="sun-3" />
                </g>
                <circle fill="#fcf4b9" transform="translate(8.167 8.167)" r={7} cy={7} cx={7} id="sun-inner" />
              </g>
              <g className="transition-all duration-250 ease-in-out opacity-0" data-name="moon" id="moon">
                <g filter="url(#moon)" transform="matrix(1, 0, 0, 1, -31.5, -5.83)">
                  <circle fill="#cce6ee" transform="translate(31.5 5.83)" r="15.167" cy="15.167" cx="15.167" data-name="moon" id="moon-3" />
                </g>
                <g className="transition-all duration-250 ease-in-out" fill="#a6cad0" transform="translate(-24.415 -1.009)" id="patches">
                  <circle transform="translate(43.009 4.496)" r={2} cy={2} cx={2} />
                  <circle transform="translate(39.366 17.952)" r={2} cy={2} cx={2} data-name="patch" />
                  <circle transform="translate(33.016 8.044)" r={1} cy={1} cx={1} data-name="patch" />
                  <circle transform="translate(51.081 18.888)" r={1} cy={1} cx={1} data-name="patch" />
                  <circle transform="translate(33.016 22.503)" r={1} cy={1} cx={1} data-name="patch" />
                  <circle transform="translate(50.081 10.53)" r="1.5" cy="1.5" cx="1.5" data-name="patch" />
                </g>
              </g>
            </g>
            <g className="transition-all duration-250 ease-in-out" filter="url(#cloud)" transform="matrix(1, 0, 0, 1, -3.5, -3.5)" id="cloud">
              <path fill="#fff" transform="translate(-3466.47 -160.94)" d="M3512.81,173.815a4.463,4.463,0,0,1,2.243.62.95.95,0,0,1,.72-1.281,4.852,4.852,0,0,1,2.623.519c.034.02-.5-1.968.281-2.716a2.117,2.117,0,0,1,2.829-.274,1.821,1.821,0,0,1,.854,1.858c.063.037,2.594-.049,3.285,1.273s-.865,2.544-.807,2.626a12.192,12.192,0,0,1,2.278.892c.553.448,1.106,1.992-1.62,2.927a7.742,7.742,0,0,1-3.762-.3c-1.28-.49-1.181-2.65-1.137-2.624s-1.417,2.2-2.623,2.2a4.172,4.172,0,0,1-2.394-1.206,3.825,3.825,0,0,1-2.771.774c-3.429-.46-2.333-3.267-2.2-3.55A3.721,3.721,0,0,1,3512.81,173.815Z" data-name="cloud" />
            </g>
            <g className="transition-all duration-250 ease-in-out opacity-0" fill="#def8ff" transform="translate(3.585 1.325)" id="stars">
              <path transform="matrix(-1, 0.017, -0.017, -1, 24.231, 3.055)" d="M.774,0,.566.559,0,.539.458.933.25,1.492l.485-.361.458.394L1.024.953,1.509.592.943.572Z" />
              <path transform="matrix(-0.777, 0.629, -0.629, -0.777, 23.185, 12.358)" d="M1.341.529.836.472.736,0,.505.46,0,.4.4.729l-.231.46L.605.932l.4.326L.9.786Z" data-name="star" />
              <path transform="matrix(0.438, 0.899, -0.899, 0.438, 23.177, 29.735)" d="M.015,1.065.475.9l.285.365L.766.772l.46-.164L.745.494.751,0,.481.407,0,.293.285.658Z" data-name="star" />
              <path transform="translate(12.677 0.388) rotate(104)" d="M1.161,1.6,1.059,1,1.574.722.962.607.86,0,.613.572,0,.457.446.881.2,1.454l.516-.274Z" data-name="star" />
              <path transform="matrix(-0.07, 0.998, -0.998, -0.07, 11.066, 15.457)" d="M.873,1.648l.114-.62L1.579.945,1.03.62,1.144,0,.706.464.157.139.438.7,0,1.167l.592-.083Z" data-name="star" />
              <path transform="translate(8.326 28.061) rotate(11)" d="M.593,0,.638.724,0,.982l.7.211.045.724.36-.64.7.211L1.342.935,1.7.294,1.063.552Z" data-name="star" />
              <path transform="translate(5.012 5.962) rotate(172)" d="M.816,0,.5.455,0,.311.323.767l-.312.455.516-.215.323.456L.827.911,1.343.7.839.552Z" data-name="star" />
              <path transform="translate(2.218 14.616) rotate(169)" d="M1.261,0,.774.571.114.3.487.967,0,1.538.728,1.32l.372.662.047-.749.728-.218L1.215.749Z" data-name="star" />
            </g>
          </g>
        </svg>
      </label>
      
      {/* Tailwind doesn't support general sibling selectors directly, so we need some custom CSS for the checked states */}
      <style jsx>{`
        #toggle:checked + svg #container {
          fill: #2b4360;
        }
        #toggle:checked + svg #button {
          transform: translate(28px, 2.333px);
        }
        #toggle:checked + svg #sun {
          opacity: 0;
        }
        #toggle:checked + svg #moon {
          opacity: 1;
        }
        #toggle:checked + svg #cloud {
          opacity: 0;
        }
        #toggle:checked + svg #stars {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

const navigation = [
  { name: 'Concours', href: '/roadmap', current: true },
  { name: 'Équipe', href: '/team', current: false },
  { name: 'Contact', href: '/contact-us', current: false }
]

function classNames(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Nav() {
  const supabase = createClientForBrowser();

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [currentLang, setCurrentLang] = useState(locale);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];

  useEffect(() => {
    async function getSession() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    }

    getSession();
  }, [supabase]);

  const switchLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    const segments = pathname.split('/');
    segments[1] = langCode; // replace locale segment
    const newPath = segments.join('/');
    router.push(newPath);
  };


  return (
    <Disclosure as="nav" className="border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            <div>
              <Switch />
            </div>
            <div className="flex items-center">
              {/* Language Switcher */}
              <Menu as="div" className="relative mr-2">
                <Menu.Button className="flex items-center space-x-1 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-700 dark:text-gray-300">
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

              {loading ? (
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
                      className="h-7 w-7 rounded-full object-cover"
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
          <div className="hidden lg:flex lg:items-center lg:justify-end lg:flex-1">
            <div className="hidden lg:flex lg:items-center lg:justify-end lg:flex-1 mr-4">
              <Switch />
            </div>
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

            {loading ? (
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
                    className="h-8 w-8 rounded-full object-cover"
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
