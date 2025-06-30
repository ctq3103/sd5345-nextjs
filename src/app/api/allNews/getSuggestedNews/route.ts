import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import News, { INews } from '@/models/News';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
	try {
		const newsIdentifier = req.nextUrl.searchParams.get('newsIdentifier');

		if (!newsIdentifier) {
			return NextResponse.json(
				{ message: 'Provide newsIdentifier' },
				{ status: 400 }
			);
		}

		const excludeCondition: Record<string, any> = mongoose.Types.ObjectId.isValid(newsIdentifier)
			? { _id: { $ne: new mongoose.Types.ObjectId(newsIdentifier) } }
			: { slug: { $ne: newsIdentifier } };

		await connectMongoDB();

		const totalCount = await News.countDocuments();
		const take = 4;
		let skip = 0;

		if (totalCount > take) {
			skip = Math.floor(Math.random() * (totalCount - take));
		}

		const newsData: INews[] = await News.find(excludeCondition)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(take);

		return NextResponse.json({ newsData }, { status: 200 });
	} catch (error: any) {
		console.error('[GET Suggested News]', error);
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message || error },
			{ status: 400 }
		);
	}
}
