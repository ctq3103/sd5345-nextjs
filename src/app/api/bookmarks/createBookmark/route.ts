import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import mongoose from 'mongoose';
import Joi from 'joi';
import { connectMongoDB } from '@/lib/mongodb';
import News from '@/models/News';
import Bookmark from '@/models/Bookmark';

const joiBookmarkSchema = Joi.object({
	userId: Joi.string().required(),
	newsIdentifier: Joi.string().required(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		await connectMongoDB();

		const session = await getServerSession(authOptions);
		const userId = session?.user?.mongoId;

		if (!userId) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const newsIdentifier = req.nextUrl.searchParams.get('newsIdentifier');

		if (!newsIdentifier) {
			return NextResponse.json(
				{ message: 'Missing newsIdentifier' },
				{ status: 400 }
			);
		}

		const { error } = joiBookmarkSchema.validate({ userId, newsIdentifier });
		if (error) {
			return NextResponse.json(
				{ message: 'Validation Error', error: error.details[0].message },
				{ status: 400 }
			);
		}

		const isValidObjectId = mongoose.Types.ObjectId.isValid(newsIdentifier);
		const query = isValidObjectId
			? { _id: newsIdentifier }
			: { slug: newsIdentifier };

		const news = await News.findOne(query);
		if (!news) {
			return NextResponse.json(
				{ message: 'News not found' },
				{ status: 404 }
			);
		}

		const bookmarkExists = await Bookmark.findOne({
			User: userId,
			News: news._id,
		});

		if (bookmarkExists) {
			return NextResponse.json(
				{ message: 'Bookmark already exists', data: bookmarkExists },
				{ status: 200 }
			);
		}

		const result = await Bookmark.create({
			User: userId,
			News: news._id,
		});

		return NextResponse.json(
			{ message: 'Bookmark created', data: result },
			{ status: 201 }
		);
	} catch (error: any) {
		console.error('Bookmark creation failed:', error);
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
