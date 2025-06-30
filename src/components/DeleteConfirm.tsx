'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Loader from './Loader';

interface DeleteConfirmProps {
	ModelType: string;
	deleteAction: () => void | Promise<void>;
}

export default function DeleteConfirm({ ModelType, deleteAction }: DeleteConfirmProps) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleDelete = async () => {
		try {
			setLoading(true);
			await deleteAction(); 
			router.replace('/admin-controls');
		} catch (err) {
			console.error('Delete failed:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen w-full flex items-center justify-center bg-white dark:bg-zinc-900 px-4'>
			<div className='w-full max-w-md bg-base-100 shadow-lg rounded-xl p-6 flex flex-col items-center'>
				<h2 className='text-lg font-semibold text-red-500 text-center mb-4'>
					Are you sure you want to delete this <span className='font-bold'>{ModelType}</span>?
				</h2>

				<button
					onClick={handleDelete}
					className='px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition'
					disabled={loading}
				>
					Yes, delete it
				</button>

				{loading && <div className='mt-4'><Loader /></div>}
			</div>
		</div>
	);
}
