'use client';

import React from 'react';
import { Ban } from 'lucide-react'; 

interface NoDataComponentProps {
	message?: string;
}

export default function NoDataComponent({
	message = 'No data available',
}: NoDataComponentProps) {
	return (
		<div className='flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400'>
			<Ban className='w-14 h-14 mb-4 text-red-400' />
			<p className='text-lg font-medium'>{message}</p>
		</div>
	);
}
