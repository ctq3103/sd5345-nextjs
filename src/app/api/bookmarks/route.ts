import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import Bookmark from '@/models/Bookmark';
import News from '@/models/News';
import User from '@/models/User';
import { connectMongoDB } from '@/lib/mongodb';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		await connectMongoDB();

		const session = await getServerSession(authOptions);
		const userId = session?.user?.mongoId;

		if (!userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const searchParams = req.nextUrl.searchParams;
		const page = parseInt(searchParams.get('page') || '1', 10);
		const perPage = 10;
		const skipCount = (page <= 1 ? 0 : page - 1) * perPage;

		const bookmarks = await Bookmark.find({ User: userId })
			.sort({ createdAt: -1 })
			.skip(skipCount)
			.limit(perPage)
			.populate({
				path: 'News',
				model: News,
			})
			.populate({
				path: 'User',
				model: User,
			});

		return NextResponse.json({ bookmarks }, { status: 200 });
	} catch (error: any) {
		console.error('GET /api/bookmarks error:', error);
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
