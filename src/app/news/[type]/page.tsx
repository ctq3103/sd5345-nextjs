'use client';

import Loader from '@/components/Loader';
import Message from '@/components/Message';
import NewsCard from '@/components/NewsCard';
import NoData from '@/components/NoData';
import ScrollMsg from '@/components/ScrollMsg';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface News {
  _id: string;
  slug: string;
  title: string;
  shortDescription: string;
  thumbnailURL: string;
}

interface ParamsType {
  type?: string;
}

export default function AllNews() {
  const [newsData, setNewsData] = useState<News[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [end, setEnd] = useState<boolean>(false);
  const [endErr, setEndErr] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams() as ParamsType;

  function formatNewsType(text?: string) {
    if (!text) return 'Recent News';
    return text
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/allNews?page=${page}&type=${params?.type || 'recent-news'}`
        );

        if (!response.ok) {
          throw new Error(`Http error! Status: ${response.status}`);
        }

        const dataArr = await response.json();

        if (!dataArr.newsData) {
          setError('Data not received');
          return;
        }

        if (dataArr.newsData.length < 1 && page === 1) {
          setEndErr(true);
          setEnd(true);
        }

        if (dataArr.newsData.length < 1) {
          setEnd(true);
        }

        setNewsData((prev) => {
          const existingIds = new Set(prev.map((n) => n._id));
          const unique = dataArr.newsData.filter((n: News) => !existingIds.has(n._id));
          return [...prev, ...unique];
        });
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, params?.type]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      if (!end) {
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [end]);

  return (
    <div className='min-h-screen px-4 py-10 bg-white text-gray-800'>
      <h2 className='text-center text-3xl sm:text-4xl font-extrabold mb-8 text-blue-600'>
        {formatNewsType(params?.type)}
      </h2>

      <div className='flex flex-wrap gap-6 justify-center max-w-7xl mx-auto'>
        {newsData.length === 0 && !loading && !error && !endErr && (
          <Message msg='No News Available' />
        )}

        {newsData.map((item) => (
          <NewsCard key={item._id} news={item} />
        ))}

        {loading && <Loader />}
        {error && <ScrollMsg msg={error} />}
        {endErr && <NoData />}
      </div>
    </div>
  );
}
