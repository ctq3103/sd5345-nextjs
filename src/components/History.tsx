
import Loader from '@/components/Loader';
import Message from '@/components/Message';
import NewsCard from '@/components/NewsCard';
import NoData from '@/components/NoData';
import ScrollMsg from '@/components/ScrollMsg';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface News {
	_id: string;
	title: string;
	slug: string;
	shortDescription?: string;
	thumbnailURL?: string;
	viewsCount?: number;
}

interface HistoryItem {
	_id: string;
	News: News;
	visitedAt?: string;
}

export default function AllNews() {
	const [histories, setHistories] = useState<HistoryItem[]>([]);
	const [page, setPage] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [end, setEnd] = useState<boolean>(false);
	const [endErr, setEndErr] = useState<boolean>(false);

	const { status } = useSession();

	useEffect(() => {
		const fetchData = async () => {
			if (loading || end) return;

			setLoading(true);
			try {
				const res = await fetch(`/api/history?page=${page}`);
				if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

				const data = await res.json();
				console.log('data', data);

				if (!data?.histories || !Array.isArray(data.histories)) {
					setError('Failed to fetch history data.');
					return;
				}

				if (data.histories.length === 0) {
					if (page === 1) setEndErr(true);
					setEnd(true);
					return;
				}

				setHistories((prev) => {
					const existingNewsIds = new Set(prev.map((h) => h.News._id));
					const unique = data.histories.filter(
						(h: HistoryItem) => h.News && !existingNewsIds.has(h.News._id)
					);
					return [...prev, ...unique];
				});

			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [page]); 


	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + window.scrollY + 100 >= document.documentElement.scrollHeight &&
				!loading && !end
			) {
				setPage((prev) => prev + 1);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [loading, end]); 


	if (status === 'loading') return <Loader />;

	return (
		<div className='min-h-screen bg-white dark:bg-zinc-900 px-4 py-6'>
			<h2 className='text-2xl font-bold text-center mb-6 text-zinc-800 dark:text-white'>
				Recently Viewed News
			</h2>

			<div className='flex flex-wrap justify-center gap-6'>
				{histories.length === 0 && !loading && !endErr && (
					<Message msg='No viewing history available.' />
				)}

				{histories.map((item) => (
					<NewsCard key={item._id} news={item.News} />
				))}
			</div>

			<div className='mt-8 flex flex-col items-center'>
				{loading && <Loader />}
				{error && <ScrollMsg msg={error} />}
				{endErr && <NoData message='You haven’t viewed any news yet.' />}
			</div>
		</div>
	);
}
