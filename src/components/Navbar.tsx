'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import {
  Menu,
  Newspaper,
  LayoutGrid,
  Flame,
  User,
  Eye,
  Home,
} from 'lucide-react';
// import { useSession } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  // const { status, data: session } = useSession();

  return (
    <div className='sticky top-0 z-30'>
      {/* Top navbar */}
      <div className='navbar bg-[var(--color-background)] text-[var(--color-foreground)] border-b border-[var(--color-border)] h-16 px-4 md:px-10'>
        <div className='flex-1'>
          <Link href='/' className='text-2xl font-bold italic text-[var(--color-primary)]'>
            News <span className='text-black'>Times</span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className='hidden lg:flex'>
          <ul className='menu menu-horizontal gap-1'>
            <li>
              <Link
                href='/'
                className={`${
                  pathname === '/' ? 'bg-[var(--color-primary)] text-white' : ''
                } flex items-center gap-1`}>
                <Home size={16} />
                Home
              </Link>
            </li>
            <li>
              <Link
                href='/news/recent-news'
                className={`${
                  pathname === '/news/recent-news' ? 'bg-[var(--color-primary)] text-white' : ''
                } flex items-center gap-1`}>
                <Newspaper size={16} />
                Recent
              </Link>
            </li>
            <li>
              <Link
                href='/categorized'
                className={`${
                  pathname === '/categorized' ? 'bg-[var(--color-primary)] text-white' : ''
                } flex items-center gap-1`}>
                <LayoutGrid size={16} />
                Categories
              </Link>
            </li>
            <li>
              <Link
                href='/news/most-viewed'
                className={`${
                  pathname === '/news/most-viewed' ? 'bg-[var(--color-primary)] text-white' : ''
                } flex items-center gap-1`}>
                <Eye size={16} />
                Viewed
              </Link>
            </li>
            <li>
              <Link
                href='/news/trending'
                className={`${
                  pathname === '/news/trending' ? 'bg-[var(--color-primary)] text-white' : ''
                } flex items-center gap-1`}>
                <Flame size={16} />
                Trending
              </Link>
            </li>
            {/* {status === 'unauthenticated' && (
              <li>
                <Link
                  href={'/profile'}
                  className={`${
                    pathname === '/profile' && 'bg-primary text-white'
                  } flex items-center gap-1`}>
                  <User size={16} />
                  Profile
                </Link>
              </li>
            )} */}
            {/* {status === 'authenticated' && (
              <div className='ml-4 flex items-center'>
                <Image
                  className='rounded-full border-2'
                  role='button'
                  src={session?.user?.image}
                  width={28}
                  height={28}
                  alt='Profile Picture'
                  onClick={() => router.push('/profile')}
                />
              </div>
            )} */}
          </ul>
        </div>

        {/* Mobile menu icon */}
        <div className='flex-none lg:hidden'>
          <label htmlFor='my-drawer-3' aria-label='open sidebar' className='btn btn-square btn-ghost'>
            <Menu size={20} />
          </label>
        </div>
      </div>

      {/* Drawer sidebar for mobile */}
      <div className='drawer drawer-end z-20'>
        <input type='checkbox' id='my-drawer-3' className='drawer-toggle' />
        <div className='drawer-side'>
          <label htmlFor='my-drawer-3' aria-label='close sidebar' className='drawer-overlay'></label>
          <div className='menu p-4 w-80 min-h-full bg-[var(--color-muted)] text-[var(--color-foreground)] gap-2'>

            <label htmlFor='my-drawer-3' className='cursor-pointer hover:bg-[var(--color-base-100)] rounded-md p-2'>
              <span
                className={`flex items-center gap-2 ${
                  pathname === '/' && 'text-[var(--color-primary)]'
                }`}
                onClick={() => router.push('/')}>
                <Home size={18} />
                Home
              </span>
            </label>

            <label htmlFor='my-drawer-3' className='cursor-pointer hover:bg-[var(--color-base-100)] rounded-md p-2'>
              <span
                className={`flex items-center gap-2 ${
                  pathname === '/news/recent-news' && 'text-[var(--color-primary)]'
                }`}
                onClick={() => router.push('/news/recent-news')}>
                <Newspaper size={18} />
                Recent News
              </span>
            </label>

            <label htmlFor='my-drawer-3' className='cursor-pointer hover:bg-[var(--color-base-100)] rounded-md p-2'>
              <span
                className={`flex items-center gap-2 ${
                  pathname === '/categorized' && 'text-[var(--color-primary)]'
                }`}
                onClick={() => router.push('/categorized')}>
                <LayoutGrid size={18} />
                Categorized
              </span>
            </label>

            <label htmlFor='my-drawer-3' className='cursor-pointer hover:bg-[var(--color-base-100)] rounded-md p-2'>
              <span
                className={`flex items-center gap-2 ${
                  pathname === '/news/most-viewed' && 'text-[var(--color-primary)]'
                }`}
                onClick={() => router.push('/news/most-viewed')}>
                <Eye size={18} />
                Most Viewed
              </span>
            </label>

            <label htmlFor='my-drawer-3' className='cursor-pointer hover:bg-[var(--color-base-100)] rounded-md p-2'>
              <span
                className={`flex items-center gap-2 ${
                  pathname === '/news/trending' && 'text-[var(--color-primary)]'
                }`}
                onClick={() => router.push('/news/trending')}>
                <Flame size={18} />
                Trending
              </span>
            </label>

            <label htmlFor='my-drawer-3' className='cursor-pointer hover:bg-[var(--color-base-100)] rounded-md p-2'>
              <span
                className={`flex items-center gap-2 ${
                  pathname === '/profile' && 'text-[var(--color-primary)]'
                }`}
                onClick={() => router.push('/profile')}>
                <User size={18} />
                Profile
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
