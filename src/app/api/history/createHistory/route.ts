import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import Joi from 'joi';
import { connectMongoDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import News from '@/models/News';
import History from '@/models/History';

const joiHistorySchema = Joi.object({
	userId: Joi.string().required(),
	newsIdentifier: Joi.string().required(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const searchParams = req.nextUrl.searchParams;
		const newsIdentifier = searchParams.get('newsIdentifier');
		const session = await getServerSession(authOptions);
		const userId = session?.user?.mongoId;

		const { error } = joiHistorySchema.validate({ userId, newsIdentifier });
		if (error) {
			return NextResponse.json(
				{ message: 'Validation Error', error: error.details[0].message },
				{ status: 400 }
			);
		}

		const isValidObjectId = mongoose.Types.ObjectId.isValid(newsIdentifier || '');
		const query = isValidObjectId
			? { _id: newsIdentifier }
			: { slug: newsIdentifier };

		await connectMongoDB();
		const news = await News.findOne(query);

		if (!news) {
			return NextResponse.json(
				{ message: 'News not found' },
				{ status: 404 }
			);
		}

		const historyExists = await History.findOneAndUpdate(
			{ User: userId, News: news._id },
			{ createdAt: new Date() },
			{ new: true }
		);

		if (historyExists) {
			return NextResponse.json(
				{ message: 'History Exists', data: historyExists },
				{ status: 200 }
			);
		}

		const result = await History.create({
			User: userId,
			News: news._id,
		});

		await News.updateOne({ _id: news._id }, { $inc: { viewsCount: 1 } });

		return NextResponse.json(
			{ message: 'History Created', data: result },
			{ status: 201 }
		);
	} catch (error: any) {
		console.error('POST /api/history/create error:', error);
		return NextResponse.json(
			{ message: 'Something went wrong', error: error.message },
			{ status: 400 }
		);
	}
}
