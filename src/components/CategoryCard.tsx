'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Category {
	_id: string;
	name: string;
	description?: string;
	thumbnailURL?: string;
}

interface CategoryCardProps {
	category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
	const router = useRouter();

	return (
		<div className='bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 w-full max-w-md'>
			{category.thumbnailURL && (
				<div className='relative h-48 w-full'>
					<Image
						src={category.thumbnailURL}
						alt={category.name}
						fill
						className='object-cover'
					/>
				</div>
			)}

			<div className='p-5'>
				<h2 className='text-xl font-semibold text-zinc-800 dark:text-white'>
					{category.name}
				</h2>

				{category.description && (
					<p className='mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3'>
						{category.description}
					</p>
				)}

				<div className='mt-4 flex justify-end gap-2'>
					<button
						className='px-4 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition'
						onClick={() =>
							router.push(`/admin-controls/categories/update/${category._id}`)
						}
					>
						Edit
					</button>
					<button
						className='px-4 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition'
						onClick={() =>
							router.push(`/admin-controls/categories/delete/${category._id}`)
						}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
