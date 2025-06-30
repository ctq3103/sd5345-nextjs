'use client';

import React from 'react';

interface MsgShowerProps {
	msg: string;
}

export default function MsgShower({ msg }: MsgShowerProps) {
	return (
		<div className='grid place-items-center w-[95%] min-h-screen mx-auto px-4'>
			<div className='text-center px-6 py-5 rounded-lg shadow-md bg-white dark:bg-zinc-800 text-red-500 border border-red-300 dark:border-red-500'>
				<p className='text-lg font-medium'>{msg}</p>
			</div>
		</div>
	);
}
