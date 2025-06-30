import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import News from '@/models/News';
import History from '@/models/History';
import type { SortOrder } from 'mongoose';

await connectMongoDB();

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const page = parseInt(searchParams.get('page') || '1');
		const type = searchParams.get('type');
		const NewsPerPage = 10;

		let query = {};
		let sortOption: { [key: string]: SortOrder } = { createdAt: -1 };

		if (type === 'most-viewed') {
			sortOption = { viewsCount: -1 };
		} else if (type === 'trending') {
			const twentyFourHAgo = new Date();
			twentyFourHAgo.setHours(twentyFourHAgo.getHours() - 24);

			const trendingNewses = await History.aggregate([
				{ $match: { createdAt: { $gte: twentyFourHAgo } } },
				{ $group: { _id: '$News', views: { $sum: 1 } } },
				{ $sort: { views: -1 } },
				{ $skip: (page - 1) * NewsPerPage },
				{ $limit: NewsPerPage },
				{
					$lookup: {
						from: 'news',
						localField: '_id',
						foreignField: '_id',
						as: 'newsDetails',
					},
				},
				{ $unwind: '$newsDetails' },
				{ $replaceRoot: { newRoot: '$newsDetails' } },
			]);

			return NextResponse.json({ newsData: trendingNewses }, { status: 200 });
		}

		const newsData = await News.find(query)
			.sort(sortOption)
			.skip((page - 1) * NewsPerPage)
			.limit(NewsPerPage);

		return NextResponse.json({ newsData }, { status: 200 });
	} catch (error: unknown) {
		console.error('Error fetching news:', error);
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
