import { Disclosure, Transition } from '@headlessui/react'
import { EnvelopeIcon } from '@heroicons/react/20/solid'
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
} from '@heroicons/react/24/outline'
import {
  Link,
  NavLink,
  useFetcher,
  useLocation,
  useSearchParams,
} from '@remix-run/react'
import { useSpinDelay } from 'spin-delay'
import Logo from '~/components/logo'
import { classNames } from '~/utils'
import { Container } from './container'

interface LinkItem {
  href: string
  name: string
}

const navigation: Array<LinkItem> = [
  { href: '/', name: 'Home' },
  { href: '/about', name: 'About' },
]

function NavBar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [urlSearchParams] = useSearchParams()
  const location = useLocation()
  const navSearchParams = new URLSearchParams(urlSearchParams)
  if (urlSearchParams.has('nav')) {
    navSearchParams.set(
      'nav',
      urlSearchParams.get('nav') === 'true' ? 'false' : 'true',
    )
  } else {
    navSearchParams.append('nav', 'true')
  }
  const authFetcher = useFetcher()
  const redirect = Array.from(urlSearchParams.keys()).length
    ? `${location.pathname}?${urlSearchParams}`
    : location.pathname
  const isLoggingInOrOut = useSpinDelay(authFetcher.state === 'submitting')

  return (
    <Disclosure
      key={urlSearchParams.get('nav')}
      defaultOpen={urlSearchParams.get('nav') === 'true'}
      as="nav"
      className="fixed inset-x-0 top-0 z-50 bg-zinc-50/95 py-2 shadow-sm shadow-zinc-100 backdrop-blur-sm dark:bg-zinc-900/95 dark:shadow-none sm:py-4"
    >
      {({ open }) => (
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center sm:w-full">
              <div className="flex items-center">
                <Link
                  to="/"
                  prefetch="intent"
                  className="-ml-2 flex h-fit w-fit items-center"
                >
                  <Logo classNames="w-8 dark:text-zinc-200 text-zinc-900" />
                  <span className="font-bold text-zinc-900 dark:text-zinc-200 sm:text-lg">
                    Supachai.dev
                  </span>
                </Link>
                <a
                  aria-label="Send an email to me"
                  href="mailto:contact@supachai.dev"
                  className="ml-4 flex w-fit text-zinc-800 hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-500"
                >
                  <EnvelopeIcon className="h-6 w-auto" />
                </a>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                {navigation.map(({ href, name }) => (
                  <NavLink
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? 'border-zinc-500 font-bold text-zinc-900 dark:text-zinc-300'
                          : 'border-transparent font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-600',
                        'inline-flex items-center pt-1 text-sm uppercase',
                      )
                    }
                    to={href}
                    prefetch="intent"
                    key={href}
                  >
                    {({ isActive }) => {
                      if (isActive) {
                        return (
                          <span className="flex flex-col items-center">
                            <span>{name}</span>
                            <span className="inline-flex h-1 w-1 rounded-full bg-zinc-900 dark:bg-zinc-600"></span>
                          </span>
                        )
                      }
                      return (
                        <span className="flex flex-col items-center">
                          <span>{name}</span>
                          <span className="inline-flex h-1 w-1 rounded-full"></span>
                        </span>
                      )
                    }}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="flex items-center sm:ml-8">
              <div className="mr-4 sm:-mr-8 sm:w-28">
                <authFetcher.Form
                  reloadDocument={isAuthenticated}
                  method="post"
                  action={
                    isAuthenticated
                      ? `/auth/logout?${new URLSearchParams({
                          redirect,
                        })}`
                      : `/auth/github?${new URLSearchParams({
                          redirect,
                        })}`
                  }
                >
                  <button
                    disabled={isLoggingInOrOut}
                    className="flex items-center text-zinc-600 hover:text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-500"
                  >
                    {isAuthenticated ? (
                      <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                    ) : (
                      <ArrowRightOnRectangleIcon className="h-6 w-6" />
                    )}
                    <span className="ml-1 text-sm font-medium">
                      {isAuthenticated
                        ? isLoggingInOrOut
                          ? 'Loggin out'
                          : 'Log out'
                        : isLoggingInOrOut
                        ? 'Loggin in'
                        : 'Log in'}
                    </span>
                  </button>
                </authFetcher.Form>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Link
                  to={`${location.pathname}?${navSearchParams}`}
                  className="hamburger-menu-link inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-300 dark:text-zinc-600 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300 dark:focus:ring-zinc-900"
                >
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Link>
              </div>
            </div>
          </div>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="my-4 sm:hidden">
              <div className="space-y-1">
                {navigation.map(({ href, name }) => (
                  <Disclosure.Button key={href} as="div">
                    <NavLink
                      to={href}
                      prefetch="intent"
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? 'rounded border-zinc-500 bg-zinc-100 font-bold text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-300'
                            : 'border-transparent font-medium text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50/50 hover:text-zinc-700 dark:hover:bg-zinc-900/30 dark:hover:text-zinc-300',
                          'nav-link block py-2 pl-3 pr-4 text-sm uppercase',
                        )
                      }
                    >
                      {name}
                    </NavLink>
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </Transition>
        </Container>
      )}
    </Disclosure>
  )
}

export default NavBar
