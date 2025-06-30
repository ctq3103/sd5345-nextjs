'use client';

import { fetchCategoryAction } from '@/actions/category';
import Loader from '@/components/Loader';
import Message from '@/components/Message';
import NewsCard from '@/components/NewsCard';
import NoData from '@/components/NoData';
import ScrollMsg from '@/components/ScrollMsg';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface News {
  _id: string;
  slug: string;
  title: string;
  shortDescription: string;
  thumbnailURL: string;
}

interface Category {
  _id: string;
  name: string;
}

interface ParamsType {
  categoryId?: string;
}

export default function ByCategory() {
  const [newsData, setNewsData] = useState<News[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [end, setEnd] = useState<boolean>(false);
  const [endErr, setEndErr] = useState<boolean>(false);
  const [category, setCategory] = useState<Category>({ _id: '', name: '' });
  const params = useParams() as ParamsType;

  useEffect(() => {
    const fetchData = async () => {
      if (params?.categoryId) {
        const categoryData = await fetchCategoryAction(params.categoryId);
        setCategory(categoryData);
      }
    };
    fetchData();
  }, [params?.categoryId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/allNews/byCategory?page=${page}&categoryId=${params.categoryId}`
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

        setNewsData((prev) => [...prev, ...dataArr.newsData]);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params?.categoryId) fetchData();
  }, [page, params?.categoryId]);

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
    <div className='min-h-screen px-4 py-10 bg-white text-gray-900'>
      <h2 className='text-center text-3xl sm:text-4xl font-bold text-blue-600 mb-8'>
        {category?.name || 'News by Category'}
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
