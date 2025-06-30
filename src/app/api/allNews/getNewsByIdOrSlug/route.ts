import { connectMongoDB } from '@/lib/mongodb';
import News from '@/models/News';
import mongoose, { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const newsIdentifier = req.nextUrl.searchParams.get('newsIdentifier');

		if (!newsIdentifier) {
			return NextResponse.json(
				{ message: 'Missing News Identifier' },
				{ status: 400 }
			);
		}

		const isValidObjectId = Types.ObjectId.isValid(newsIdentifier);
		const query = isValidObjectId
			? { _id: new Types.ObjectId(newsIdentifier) }
			: { slug: newsIdentifier };

		await connectMongoDB();

		const news = await News.findOne(query);

		if (!news) {
			return NextResponse.json({ message: 'News not found' }, { status: 404 });
		}

		return NextResponse.json({ news }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
