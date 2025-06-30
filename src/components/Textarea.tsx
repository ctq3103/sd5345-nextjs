import { MdErrorOutline } from 'react-icons/md';
import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	labelAttr?: string;
	nameAttr: string;
	classAttr?: string;
	placeholderAttr?: string;
	requiredAttr?: boolean;
	errorAttr?: string;
}

export default function Textarea({
	labelAttr,
	nameAttr,
	classAttr = '',
	placeholderAttr = '',
	requiredAttr = false,
	errorAttr,
	...props
}: TextareaProps) {
	return (
		<label className='form-control w-full'>
			{labelAttr && (
				<div className='label px-0'>
					<span className='label-text text-sm text-gray-700 dark:text-gray-200'>
						{labelAttr}
					</span>
				</div>
			)}

			<div className='relative'>
				<textarea
					name={nameAttr}
					required={requiredAttr}
					placeholder={placeholderAttr}
					className={`w-full bg-white text-slate-900 rounded-xl px-4 py-3 outline-none border transition resize-y min-h-[120px] ${
						errorAttr
							? 'border-red-500 focus:border-red-500'
							: 'border-gray-600 focus:border-blue-500'
					} placeholder:text-sm placeholder:text-[#989DBB] ${classAttr}`}
					{...props}
				></textarea>
			</div>

			{errorAttr && (
				<div className='label px-0'>
					<span className='label-text text-red-500 text-sm flex items-center gap-2'>
						<MdErrorOutline className='inline-block text-lg' />
						{errorAttr}
					</span>
				</div>
			)}
		</label>
	);
}
