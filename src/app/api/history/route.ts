import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import History from '@/models/History';
import News from '@/models/News';
import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/User';

await connectMongoDB();

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const pageStr = searchParams.get('page');
		const page = pageStr ? parseInt(pageStr, 10) : 1;

		if (isNaN(page) || page < 1) {
			return NextResponse.json(
				{ message: 'Invalid page number' },
				{ status: 400 }
			);
		}

		const session = await getServerSession(authOptions);
		const userId = session?.user?.mongoId;

		if (!userId) {
			return NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const HistoryPerPage = 10;
		const skip = (page - 1) * HistoryPerPage;

		const histories = await History.find({ User: userId })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(HistoryPerPage)
			.populate({
				path: 'News',
				model: News,
			})
			.populate({
				path: 'User',
				model: User,
			});

		return NextResponse.json({ histories }, { status: 200 });
	} catch (error) {
		console.error('Error in GET /api/history:', error);
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 500 }
		);
	}
}
