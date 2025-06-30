'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface News {
	_id: string;
	slug: string;
	title: string;
	shortDescription?: string;
	thumbnailURL?: string;
	viewsCount?: number;
}

interface NewsCardProps {
	news: News | null;
}

export default function NewsCard({ news }: NewsCardProps) {
	const router = useRouter();
	const pathname = usePathname();

	// ✅ Handle invalid or null news object
	if (!news || !news._id || !news.title || !news.slug) {
		return (
			<div className='w-full md:w-96 h-64 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse'></div>
		);
	}

	const fallbackImg = 'https://via.placeholder.com/600x400?text=No+Image';

	return (
		<div
			onClick={() => router.push(`/news/view/${news.slug}`)}
			className='group hover:cursor-pointer md:w-96 sm:max-w-96 w-full bg-white dark:bg-slate-800 shadow-md hover:shadow-xl rounded-xl overflow-hidden transition duration-300'
		>
			<figure className='relative h-48 w-full'>
				<Image
					src={news.thumbnailURL ?? fallbackImg}
					alt={news.title}
					fill
					className='object-cover'
				/>
			</figure>

			<div className='p-5 text-zinc-800 dark:text-gray-100'>
				<h2 className='text-lg font-semibold group-hover:text-indigo-500 transition-colors line-clamp-2'>
					{news.title}
				</h2>

				{news.shortDescription && (
					<p className='mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3'>
						{news.shortDescription}
					</p>
				)}

				<div className='mt-3 text-xs text-gray-500 dark:text-gray-400'>
					{news.viewsCount ?? 0} views
				</div>

				{pathname.includes('/admin-controls') && (
					<div className='flex justify-end gap-2 mt-4'>
						<button
							className='px-3 py-1 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition'
							onClick={(e) => {
								e.stopPropagation();
								router.push(`/admin-controls/news/update/${news._id}`);
							}}
						>
							Edit
						</button>
						<button
							className='px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition'
							onClick={(e) => {
								e.stopPropagation();
								router.push(`/admin-controls/news/delete/${news._id}`);
							}}
						>
							Delete
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
