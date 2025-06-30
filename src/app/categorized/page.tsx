'use client';

import Loader from '@/components/Loader';
import Message from '@/components/Message';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CgArrowRight } from 'react-icons/cg';

interface NewsItem {
	_id: string;
	title: string;
	slug: string;
	thumbnailURL: string;
	createdAt: string;
	shortDescription: string;
}

interface Category {
	_id: string;
	name: string;
}

interface CategoryWithNews {
	category: Category;
	news: NewsItem[];
}

export default function CategorizedNews() {
	const [categoriesWithNews, setCategoriesWithNews] = useState<CategoryWithNews[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCategoriesWithNews = async () => {
			try {
				const response = await fetch('/api/categorizedNews');
				if (!response.ok) throw new Error('Failed to fetch categorized news.');

				const data = await response.json();
				setCategoriesWithNews(data.categoriesWithNews);
			} catch (err: any) {
				setError(err.message || 'Something went wrong.');
			} finally {
				setLoading(false);
			}
		};

		fetchCategoriesWithNews();
	}, []);

	if (loading) return <Loader />;
	if (error) return <Message msg={error} />;

	return (
		<section className='max-w-7xl mx-auto px-4 py-8'>
			{categoriesWithNews.length === 0 ? (
				<p className='text-center text-gray-500 text-lg'>No categories found!</p>
			) : (
				categoriesWithNews.map(({ category, news }) => (
					<div key={category._id} className='mb-12'>
						<div className='flex items-center justify-between mb-4'>
							<h2 className='text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white'>
								{category.name}
							</h2>
							<Link
								href={`/news/byCategory/${category._id}`}
								className='flex items-center gap-2 text-primary hover:underline font-medium text-sm md:text-base'>
								View Category <CgArrowRight size={18} />
							</Link>
						</div>

						{news?.length > 0 ? (
							<div className='flex flex-wrap gap-4'>
								{news.map((item) => (
									<NewsCard key={item._id} news={item} />
								))}
							</div>
						) : (
							<p className='text-sm text-gray-500 italic'>
								No blogs available in this category.
							</p>
						)}
					</div>
				))
			)}
		</section>
	);
}
