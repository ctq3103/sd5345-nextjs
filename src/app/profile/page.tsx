'use client';

import SignIn from '@/components/SignIn';
// import Bookmark from '@/components/Bookmark';
// import History from '@/components/History';
// import Loader from '@/components/Loader';
// import SigninBtn from '@/components/SigninBtn';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';

interface Tab {
	title: string;
	component: React.ReactNode;
}

export default function Profile() {
	const { status, data: session } = useSession();
	const [activeTab, setActiveTab] = useState<number>(0);

	// const tabs: Tab[] = [
	// 	{ title: 'History', component: <History /> },
	// 	{ title: 'Bookmark', component: <Bookmark /> },
	// ];

	// if (status === 'loading') return <Loader />;

	if (status === 'authenticated') {
		return (
			<div className='max-w-4xl mx-auto px-4 py-8'>
				<div className='flex flex-col items-center gap-4 bg-white p-6 rounded-2xl shadow-xl border border-slate-200'>
					<button
						onClick={() => signOut()}
						className='self-end px-4 py-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 text-sm transition'>
						Sign Out
					</button>

					<Image
						src={session.user?.image ?? 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
						alt='User Avatar'
						width={100}
						height={100}
						className='rounded-full shadow-md border border-slate-300'
					/>

					<div className='text-center'>
						<p className='text-lg font-semibold text-slate-800'>
							{session.user?.name}
						</p>
						<p className='text-sm text-slate-500'>{session.user?.email}</p>
					</div>
				</div>

				{/* Tabs */}
				<div className='mt-8'>
					<div className='flex justify-center mb-4'>
						<div className='flex bg-slate-100 rounded-full shadow-inner overflow-hidden'>
							{/* {tabs.map((tab, index) => (
								<button
									key={index}
									className={`px-6 py-2 text-sm font-medium transition-all duration-200 ${
										activeTab === index
											? 'bg-indigo-600 text-white'
											: 'text-slate-600 hover:bg-slate-200'
									}`}
									onClick={() => setActiveTab(index)}>
									{tab.title}
								</button>
							))} */}
						</div>
					</div>

					{/* <div className='bg-white p-4 rounded-xl shadow-sm border border-slate-200'>
						{tabs[activeTab].component}
					</div> */}
				</div>
			</div>
		);
	}

	// Not authenticated
	return (
		<div className='flex items-center justify-center h-screen bg-slate-50 px-4'>
			<SignIn />
		</div>
	);
}
