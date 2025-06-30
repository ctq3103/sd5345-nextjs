'use client';

import { fetchAllCategoryAction } from '@/actions/category';
import CategoryCard from '@/components/CategoryCard';
import Loader from '@/components/Loader';
import Message from '@/components/Message';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Category {
	_id: string;
	name: string;
	description?: string;
}

export default function Categories() {
	const router = useRouter();
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const { status } = useSession();

	useEffect(() => {
		const fetchCategories = async () => {
			setLoading(true);
			try {
				const fetchedCategoryData = await fetchAllCategoryAction();
				setCategories(fetchedCategoryData);
			} catch (error) {
				console.error('Error fetching categories:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	if (loading || status === 'loading') return <Loader />;

	if (categories.length < 1)
		return <Message msg='No categories available!' />;

	return (
		<div className='max-w-6xl mx-auto px-4 py-6'>
			<div className='flex flex-col md:flex-row items-center justify-between mb-6'>
				<h2 className='text-2xl font-semibold text-slate-800 mb-4 md:mb-0'>
					All Categories
				</h2>
				<button
					className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-sm transition-all duration-200'
					onClick={() => router.push('/admin-controls/categories/add-new')}>
					Add Category
				</button>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{categories.map((category) => (
					<CategoryCard category={category} key={category._id} />
				))}
			</div>
		</div>
	);
}
