'use client';

import NewsCard from "./NewsCard";
import Message from "./Message";

interface News {
	_id: string;
	title: string;
	slug: string;
	shortDescription?: string;
	thumbnailURL?: string;
	viewsCount?: number;
}

interface RecentNewsProps {
	newsData: News[] | null | undefined;
}

export default function RecentNews({ newsData }: RecentNewsProps) {
	return (
		<div className='w-full'>
			<h2 className='py-6 text-center text-2xl font-semibold text-zinc-800 dark:text-white underline italic'>
				Recently Added
			</h2>

			<div className='flex flex-wrap gap-6 justify-center px-6 pb-10'>
				{!newsData || newsData.length === 0 ? (
					<Message msg='No News Available!' />
				) : (
					newsData.map((item) => (
						<NewsCard
                         key={item._id} news={item} />
					))
				)}
			</div>
		</div>
	);
}
