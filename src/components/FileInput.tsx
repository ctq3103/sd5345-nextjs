'use client';

import { MdCloudUpload } from 'react-icons/md';
import React, { ChangeEvent } from 'react';

interface FileInputProps {
	nameAttr: string;
	requiredAttr?: boolean;
	selectedFile: string | null;
	setSelectedFile: (value: string | null) => void;
}

export default function FileInput({
	nameAttr,
	requiredAttr = false,
	selectedFile,
	setSelectedFile,
}: FileInputProps) {
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return setSelectedFile(null);

		if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					setSelectedFile(e.target.result as string);
				}
			};
			reader.readAsDataURL(file);
		} else {
			alert('Please select a valid image file (jpg, jpeg, png).');
			setSelectedFile(null);
		}
	};

	return (
		<div>
			<label
				htmlFor={nameAttr}
				className='flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer bg-slate-200 dark:bg-slate-700 hover:border-blue-500 transition'
			>
				{selectedFile ? (
					<div>
						<img
							src={selectedFile}
							alt='preview'
							className='w-48 h-auto object-cover rounded-lg shadow-md'
						/>
					</div>
				) : (
					<div className='flex flex-col items-center justify-center pt-5 pb-6 text-gray-600 dark:text-gray-300'>
						<MdCloudUpload className='w-12 h-12 text-blue-500' />
						<p className='text-sm mt-2'>
							<span className='font-semibold'>Click to Upload</span> or drag an image here
						</p>
					</div>
				)}

				<input
					type='file'
					id={nameAttr}
					name={nameAttr}
					className='sr-only'
					required={requiredAttr}
					accept='image/png, image/jpeg'
					onChange={handleFileChange}
				/>
			</label>
		</div>
	);
}
