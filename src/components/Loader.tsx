'use client';

import React from 'react';

export default function Loader() {
	return (
		<div className='w-full flex justify-center items-center py-6'>
			<div className='flex gap-2'>
				<div className='w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:0s]'></div>
				<div className='w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:0.15s]'></div>
				<div className='w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:0.3s]'></div>
			</div>
		</div>
	);
}

