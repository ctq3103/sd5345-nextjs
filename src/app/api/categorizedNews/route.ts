import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Category, { ICategory } from '@/models/Category';
import News, { INews } from '@/models/News';

interface CategoryWithNews {
	category: ICategory;
	news: INews[];
}

export async function GET(req: NextRequest) {
	try {
		await connectMongoDB();

		const categories: ICategory[] = await Category.find();

		const categoriesWithNews: CategoryWithNews[] = await Promise.all(
			categories.map(async (category) => {
				const recentNews: INews[] = await News.find({ categories: category._id })
					.sort({ createdAt: -1 })
					.limit(3);
				return {
					category,
					news: recentNews,
				};
			})
		);

		return NextResponse.json({ categoriesWithNews }, { status: 200 });
	} catch (error) {
		console.error('[CategorizedNews API]', error);
		return NextResponse.json(
			{ message: 'Something went wrong', error },
			{ status: 400 }
		);
	}
}
