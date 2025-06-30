import RecentNews from '@/components/RecentNews';

interface NewsItem {
	_id: string;
	title: string;
	slug: string;
	shortDescription: string;
	thumbnailURL: string;
	categories: { name: string }[];
	createdAt: string;
}

const fetchNewsData = async (): Promise<NewsItem[] | null> => {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/allNews?page=1`,
			{
				next: { revalidate: 3600 },
			}
		);
		if (!res.ok) return null;
		const data = await res.json();
		console.log(data);
		return data.newsData;
	} catch (error) {
		console.error('Error fetching news:', error);
		return null;
	}
};

export default async function Home() {
	const newsData = await fetchNewsData();

	return (
		<div className='min-h-screen bg-gradient-to-tr from-white via-gray-100 to-blue-50'>
			<section className='relative overflow-hidden'>
                <div className='absolute inset-0'>
                    <img
                        src='https://picsum.photos/1920/1280'
                        alt='Hero Background'
                        className='w-full h-full object-cover brightness-75'
                    />
                    <div className='absolute inset-0 bg-opacity-30 backdrop-blur-sm'></div>
                </div>

                <div className='relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32'>
                    <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight'>
                        Your Daily Dose of 🔥
                        <br />
                        <span className='text-blue-600'>Buzz, Tech & Culture</span>
                    </h1>
                    <p className='mt-6 text-lg text-gray-700 max-w-2xl'>
                        Fresh updates on everything trending — from viral tech to pop culture
                        highlights. We keep it real, relevant, and ridiculously fun.
                    </p>
                    <div className='mt-8 flex gap-4'>
                        <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-all'>
                            Get Started
                        </button>
                        <button className='bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-semibold py-2 px-6 rounded-full shadow-md transition-all'>
                            Learn More
                        </button>
                    </div>
                </div>
            </section>


			<section className='px-4 sm:px-8 md:px-12 lg:px-20 py-16'>
				<h2 className='text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center'>
					Recent News
				</h2>
				<RecentNews newsData={newsData} />
			</section>
		</div>
	);
}
