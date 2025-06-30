'use client';

import React from 'react';

interface ScrollMsgProps {
	msg: string;
}

export default function ScrollMsg({ msg }: ScrollMsgProps) {
	return (
		<div className='w-full overflow-hidden mt-6'>
			<h1 className='whitespace-nowrap animate-marquee text-xl sm:text-2xl text-red-500 font-semibold text-center'>
				{msg}
			</h1>
		</div>
	);
}
