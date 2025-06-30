'use client';

import Loader from '@/components/Loader';
import Message from '@/components/Message';
import NewsCard from '@/components/NewsCard';
import NoData from '@/components/NoData';
import ScrollMsg from '@/components/ScrollMsg';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface News {
	_id: string;
	slug: string;
	title: string;
	shortDescription?: string;
	thumbnailURL?: string;
	viewsCount?: number;
}

interface BookmarkItem {
	_id: string;
	News: News;
}

export default function Bookmark() {
	const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
	const [page, setPage] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [end, setEnd] = useState<boolean>(false);
	const [endErr, setEndErr] = useState<boolean>(false);

	const router = useRouter();
	const params = useParams();
	const { status } = useSession();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch(`/api/bookmarks?page=${page}`);
				if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
				const dataArr = await response.json();

				if (!dataArr.bookmarks) {
					setError('Failed to load bookmarks');
					return;
				}

				if (dataArr.bookmarks.length === 0) {
					if (page === 1) setEndErr(true);
					setEnd(true);
				} else {
					setBookmarks((prev) => [...prev, ...dataArr.bookmarks]);
				}
			} catch (err: any) {
				setError(err.message || 'An error occurred');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [page]);

	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop + 1 >=
				document.documentElement.scrollHeight
			) {
				if (!end && !loading) {
					setPage((prev) => prev + 1);
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [end, loading]);

	if (status === 'loading') return <Loader />;

	return (
		<div className='min-h-screen bg-white dark:bg-zinc-900 px-4 py-6'>
			<h2 className='text-2xl font-bold text-center mb-6 text-zinc-800 dark:text-white'>
				Bookmarked News
			</h2>

			<div className='flex flex-wrap justify-center gap-6'>
				{bookmarks.length === 0 && !loading && !endErr && (
					<Message msg='No news bookmarked yet.' />
				)}

				{bookmarks.map((item) => (
					<NewsCard key={item._id} news={item.News} />
				))}
			</div>

			<div className='mt-8 flex flex-col items-center'>
				{loading && <Loader />}
				{error && <ScrollMsg msg={error} />}
				{endErr && <NoData message='You haven’t bookmarked any news yet.' />}
			</div>
		</div>
	);
}
