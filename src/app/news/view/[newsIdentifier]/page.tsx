import BookmarkButton from '@/components/BookmarkButton';
import CreateHistory from '@/components/CreateHistory';
import NewsCard from '@/components/NewsCard';
import Image from 'next/image';
import { FiUser } from 'react-icons/fi';
import { formatReadableDateTime } from '@/lib/formatTime';

interface NewsType {
  _id: string;
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  thumbnailURL: string;
}

interface ParamsType {
  params: {
    newsIdentifier: string;
  };
}

const fetchNews = async (newsIdentifier: string): Promise<NewsType | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/allNews/getNewsByIdOrSlug?newsIdentifier=${newsIdentifier}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.news;
};

const fetchSuggestedNews = async (newsIdentifier: string): Promise<NewsType[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/allNews/getSuggestedNews?newsIdentifier=${newsIdentifier}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.newsData;
};

export default async function ViewNews({ params }: ParamsType) {
  const { newsIdentifier } = params;
  const news = await fetchNews(newsIdentifier);
  const suggestedNewses = await fetchSuggestedNews(newsIdentifier);

  if (!news) {
    return (
      <main className='min-h-screen flex items-center justify-center'>
        <p className='text-xl text-red-600'>News not found.</p>
      </main>
    );
  }

  return (
    <main className='bg-white text-gray-900'>
      <div className='py-12 px-6 max-w-7xl mx-auto'>
        <div className='mb-10'>
          <h4 className='text-sm uppercase text-blue-500 font-medium mb-2 tracking-wide'>Featured News</h4>
          <h1 className='text-3xl md:text-4xl font-bold leading-snug mb-4'>{news.title}</h1>
          <div className='flex justify-between items-center border-b pb-3 text-sm text-gray-500'>
            <p className='flex items-center gap-2'>
              <FiUser /> NewsVibe • {formatReadableDateTime(news.createdAt)}
            </p>
            <BookmarkButton newsIdentifier={newsIdentifier} />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>
          <div className='lg:col-span-8'>
            <Image
              height={400}
              width={800}
              className='w-full h-auto rounded-lg shadow-md'
              src={news.thumbnailURL}
              alt={news.title}
            />
            <p className='text-xs mt-2 text-gray-500'>Image: Internet</p>

            <div
              dangerouslySetInnerHTML={{ __html: news.description }}
              className='prose prose-lg mt-6 max-w-none'
            ></div>

            <div className='flex flex-wrap gap-3 mt-8'>
              <span className='bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm'>#News</span>
              <span className='bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm'>#NewsVibe</span>
              <span className='bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm'>#SEO</span>
            </div>
          </div>

          <div className='lg:col-span-4'>
            <h2 className='text-xl font-semibold mb-5 text-blue-600'>Explore More</h2>
            <div className='flex flex-col gap-5'>
              {suggestedNewses.map((item) => (
                <NewsCard key={item._id} news={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <CreateHistory />
    </main>
  );
}
