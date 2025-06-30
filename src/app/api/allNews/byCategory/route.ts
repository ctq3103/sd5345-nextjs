import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose';
import Category from '@/models/Category';
import News from '@/models/News';
import { connectMongoDB } from '@/lib/mongodb';

await connectMongoDB();

export async function GET(request: NextRequest) {
	try {
		const pageParam = request.nextUrl.searchParams.get('page');
		const categoryId = request.nextUrl.searchParams.get('categoryId');

		const page = pageParam ? parseInt(pageParam, 10) : 1;
		const NewsPerPage = 10;

		const query: Record<string, unknown> = {};

		if (categoryId && Types.ObjectId.isValid(categoryId)) {
			query.categories = new Types.ObjectId(categoryId);
		}

		const newsData = await News.find(query)
			.sort({ createdAt: -1 })
			.skip((page - 1) * NewsPerPage)
			.limit(NewsPerPage)
			.populate({
				path: 'categories',
				model: Category,
			});

		return NextResponse.json({ newsData }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
