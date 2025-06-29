'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { SiGoogle } from 'react-icons/si';

export default function SignIn() {
	return (
		<div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-slate-100 px-4 py-12'>
			<div className='bg-white rounded-2xl p-8 sm:p-10 max-w-md w-full text-center shadow-xl border border-slate-200'>

				<h1 className='text-3xl font-bold text-slate-800 mb-2'>Welcome Back</h1>
				<p className='text-slate-600 mb-6 text-sm'>
					Sign in to access your dashboard and explore awesome features.
				</p>

				<button
					onClick={() => signIn('google')}
					className='flex items-center justify-center w-full gap-3 bg-slate-100 text-slate-800 font-medium rounded-full px-5 py-3 hover:bg-slate-200 transition shadow-sm border border-slate-300'>
					<SiGoogle size={20} className='text-red-500' />
					<span>Continue with Google</span>
				</button>

				<div className='mt-6 text-xs text-slate-500'>
					By signing in, you agree to our{' '}
					<Link href='/tos' className='text-indigo-600 hover:underline'>
						Terms of Service
					</Link>{' '}
					and{' '}
					<Link href='/privacy' className='text-indigo-600 hover:underline'>
						Privacy Policy
					</Link>
				</div>
			</div>
		</div>
	);
}
