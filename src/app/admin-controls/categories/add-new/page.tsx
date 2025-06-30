'use client';

import { createCategoryAction } from '@/actions/category';
import FileInput from '@/components/FileInput';
import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import Textarea from '@/components/Textarea';
import { FormEvent, useRef, useState } from 'react';

export default function CreateCategory() {
	const formRef = useRef<HTMLFormElement>(null);
	const successRef = useRef<HTMLParagraphElement>(null);
	const failedRef = useRef<HTMLParagraphElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	return (
		<div className='grid place-items-center min-h-screen bg-slate-50 px-4'>
			<form
				ref={formRef}
				action={async (formData: FormData) => {
					if (successRef.current) successRef.current.textContent = '';
					if (failedRef.current) failedRef.current.textContent = '';

					const result = await createCategoryAction(formData);

					if (result?.success) {
						formRef.current?.reset();
						setSelectedFile(null);
						if (successRef.current) successRef.current.textContent = 'Created!';
					} else {
						if (failedRef.current) failedRef.current.textContent = result?.error ?? 'Something went wrong.';
					}
				}}
				className='w-[90%] sm:w-[580px] shadow-xl p-8 rounded-lg flex flex-col gap-4 bg-white border border-slate-200'>
				
				<h2 className='text-slate-800 font-bold text-2xl text-center mb-4'>
					Create Category
				</h2>

				<Input
					typeAttr='text'
					nameAttr='name'
					placeholderAttr='Category Name'
					requiredAttr={true}
					classAttr='w-full'
				/>

				<Textarea
					nameAttr='description'
					placeholderAttr='Description'
					requiredAttr={true}
					classAttr='w-full resize-none'
				/>

				{/* <FileInput
					nameAttr='thumbnailImage'
					selectedFile={selectedFile}
					setSelectedFile={setSelectedFile}
				/> */}

				<div className='self-center mt-4'>
					<SubmitButton />
				</div>

				<p ref={successRef} className='text-green-600 text-center font-semibold'></p>
				<p ref={failedRef} className='text-red-600 text-center font-semibold'></p>
			</form>
		</div>
	);
}
