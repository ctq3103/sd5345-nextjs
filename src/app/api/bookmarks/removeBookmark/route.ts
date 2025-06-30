import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import mongoose from 'mongoose';

import { connectMongoDB } from '@/lib/mongodb';
import { authOptions } from '../../auth/[...nextauth]/route';
import News from '@/models/News';
import Bookmark from '@/models/Bookmark';

const joiBookmarkSchema = Joi.object({
	userId: Joi.string().required(),
	newsIdentifier: Joi.string().required(),
});

export async function DELETE(req: NextRequest): Promise<NextResponse> {
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
			return NextResponse.json({ message: 'News not found' }, { status: 404 });
		}

		const bookmark = await Bookmark.findOneAndDelete({
			User: userId,
			News: news._id,
		});

		if (!bookmark) {
			return NextResponse.json(
				{ message: 'Bookmark not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: 'Bookmark deleted', data: bookmark },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error('DELETE Bookmark Error:', error);
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
