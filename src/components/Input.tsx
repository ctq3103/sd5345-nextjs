'use client';

import React, { InputHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react'; 

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	labelAttr?: string;
	nameAttr: string;
	typeAttr?: string;
	classAttr?: string;
	placeholderAttr?: string;
	requiredAttr?: boolean;
	errorAttr?: string;
}

export default function Input({
	labelAttr,
	typeAttr = 'text',
	nameAttr,
	classAttr = '',
	placeholderAttr = '',
	requiredAttr = false,
	errorAttr,
	...props
}: InputProps) {
	return (
		<label className='form-control w-full'>
			{labelAttr && (
				<span className='text-sm font-medium text-gray-700 mb-1 block'>
					{labelAttr}
				</span>
			)}

			<div className='relative'>
				<input
					className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition 
						${errorAttr
							? 'border-red-500 focus:ring-red-500'
							: 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
						} bg-white text-gray-900 placeholder:text-gray-400 shadow-sm ${classAttr}`}
					type={typeAttr}
					name={nameAttr}
					placeholder={placeholderAttr}
					required={requiredAttr}
					{...props}
				/>
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
