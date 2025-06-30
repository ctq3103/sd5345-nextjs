'use client';

import React, { SelectHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	labelAttr?: string;
	nameAttr: string;
	classAttr?: string;
	placeholderAttr?: string;
	requiredAttr?: boolean;
	errorAttr?: string;
	optionsAttr: string[];
}

export default function Select({
	labelAttr,
	nameAttr,
	classAttr = '',
	placeholderAttr,
	requiredAttr = false,
	errorAttr,
	optionsAttr = [],
	...props
}: SelectProps) {
	return (
		<label className='form-control w-full'>
			{labelAttr && (
				<span className='text-sm font-medium text-gray-700 mb-1 block'>
					{labelAttr}
				</span>
			)}

			<div className='relative'>
				<select
					name={nameAttr}
					required={requiredAttr}
					className={`w-full appearance-none bg-white text-gray-900 border rounded-xl px-4 py-3 pr-10 shadow-sm text-sm 
						transition focus:outline-none focus:ring-2
						${errorAttr ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
						${classAttr}`}
					{...props}
				>
					{placeholderAttr && (
						<option value='' disabled hidden>
							{placeholderAttr}
						</option>
					)}
					{optionsAttr.map((item, index) => (
						<option key={index} value={item}>
							{item}
						</option>
					))}
				</select>

				<div className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400'>
					<svg
						className='w-4 h-4'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						viewBox='0 0 24 24'
					>
						<path d='M6 9l6 6 6-6' />
					</svg>
				</div>
			</div>

			{errorAttr && (
				<p className='mt-1 text-sm text-red-500 flex items-center gap-1'>
					<AlertCircle className='w-4 h-4' />
					{errorAttr}
				</p>
			)}
		</label>
	);
}
