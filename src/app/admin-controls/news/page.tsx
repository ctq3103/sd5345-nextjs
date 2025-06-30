'use client';

import Loader from '@/components/Loader';
import Message from '@/components/Message';
import NewsCard from '@/components/NewsCard';
import ScrollMsg from '@/components/ScrollMsg';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface INews {
  _id: string;
  slug: string;
  title: string;
  content: string;
  image?: string;
  category?: string;
  publishedAt?: string;
}

export default function AllNews() {
  const [newsData, setNewsData] = useState<INews[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [end, setEnd] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/allNews?page=${page}`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data: { newsData: INews[] } = await response.json();

        if (!data.newsData || data.newsData.length === 0) {
          setEnd(true);
          return;
        }

        setNewsData((prev) => [...prev, ...data.newsData]);
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
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        if (!end && !loading) setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [end, loading]);

  return (
    <div className='min-h-screen bg-[#f9fafb] dark:bg-[#121212] text-gray-900 dark:text-white px-4 sm:px-8'>
      <div className='flex items-center justify-between py-6 border-b border-gray-200 dark:border-gray-700'>
        <h1 className='text-2xl font-bold tracking-tight'>📰 All News</h1>
        <button
          className='bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md transition'
          onClick={() => router.push('/admin-controls/news/add-new')}
        >
            Add News
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-8'>
        {newsData.length === 0 && !loading && !error && (
          <Message msg='No News Available' />
        )}

        {newsData.map((item) => (
          <NewsCard key={item._id} news={item} />
        ))}
      </div>

      <div className='flex flex-col items-center mb-10'>
        {loading && <Loader />}
        {error && <ScrollMsg msg={error} />}
        {end && <ScrollMsg msg='📭 No further news!' />}
      </div>
    </div>
  );
}
