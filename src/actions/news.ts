'use server';

import { connectMongoDB } from '@/lib/mongodb';
import News, { INews } from '@/models/News';
import Joi from 'joi';
import { Types } from 'mongoose';

const joiNewsCreateSchema = Joi.object({
	title: Joi.string().required(),
	shortDescription: Joi.string().required(),
	categories: Joi.array().items(Joi.string().min(1).required()),
	description: Joi.string().required(),
	author: Joi.string().required(),
	thumbnailURL: Joi.string().required(),
});

const joiNewsUpdateSchema = Joi.object({
	title: Joi.string().required(),
	shortDescription: Joi.string().required(),
	categories: Joi.array().items(Joi.string().min(1).required()),
	description: Joi.string().required(),
	author: Joi.string().required(),
	thumbnailURL: Joi.string().allow('').optional(),
});

const createSlug = (title: string): string => {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
};

export const fetchNewsAction = async (_id: string): Promise<INews | null> => {
	try {
		await connectMongoDB();
		const result = await News.findOne({ _id });
		return result ? JSON.parse(JSON.stringify(result)) : null;
	} catch (error: any) {
		throw new Error(error.message || 'Unknown error');
	}
};

export const addNewsAction = async (formData: FormData): Promise<{ success?: true; error?: string }> => {
	try {
		const title = formData.get('title')?.toString() || '';
		const shortDescription = formData.get('shortDescription')?.toString() || '';
		const description = formData.get('description')?.toString() || '';
		const author = formData.get('author')?.toString() || '';
		const categories = formData.getAll('categories').map((c) => c.toString());
		const thumbnailURL = 'https://picsum.photos/600/400';

		const { error } = joiNewsCreateSchema.validate({
			title,
			shortDescription,
			description,
			author,
			categories,
			thumbnailURL,
		});

		if (error) {
			throw new Error(error.details[0].message);
		}

		await connectMongoDB();

		let slug = createSlug(title);
		let exists = await News.findOne({ slug });
		let counter = 1;

		while (exists) {
			slug = `${createSlug(title)}-${counter++}`;
			exists = await News.findOne({ slug });
		}

		const result = await News.create({
			title,
			slug,
			shortDescription,
			description,
			author,
			categories,
			thumbnailURL,
		});

		if (result) return { success: true };
		return { error: 'Failed to create news' };
	} catch (error: any) {
		return { error: error.message || 'Unknown error' };
	}
};

export const updateNewsAction = async (formData: FormData): Promise<{ success?: true; error?: string }> => {
	try {
		const newsId = formData.get('newsId')?.toString() || '';
		const title = formData.get('title')?.toString() || '';
		const shortDescription = formData.get('shortDescription')?.toString() || '';
		const description = formData.get('description')?.toString() || '';
		const author = formData.get('author')?.toString() || '';
    const authorObjectId = new Types.ObjectId(author);
		const thumbnailImage = formData.get('thumbnailImage') as File | null;
		const categories = formData.getAll('categories').map((c) => c.toString());
    const categoriesObjectIds = categories.map((id) => new Types.ObjectId(id));
		const thumbnailURL = 'https://picsum.photos/600/400';

		const { error } = joiNewsUpdateSchema.validate({
			title,
			shortDescription,
			description,
			author,
			categories,
			thumbnailURL,
		});

		if (error) {
			throw new Error(error.details[0].message);
		}

		await connectMongoDB();

		const existingNews = await News.findById(newsId);
		if (!existingNews) {
			throw new Error('News not found');
		}

		existingNews.title = title;
		existingNews.shortDescription = shortDescription;
		existingNews.description = description;
		existingNews.author = authorObjectId;
		existingNews.categories = categoriesObjectIds;

		if (thumbnailImage && thumbnailImage.size > 0) {
			existingNews.thumbnailURL = thumbnailURL;
		}

		const result = await existingNews.save();
		if (result) return { success: true };
		return { error: 'Update failed' };
	} catch (error: any) {
		return { error: error.message || 'Unknown error' };
	}
};

export const deleteNewsAction = async (_id: string): Promise<{ success?: true; error?: string }> => {
	try {
		await connectMongoDB();
		const result = await News.findByIdAndDelete(_id);
		if (result) return { success: true };
		return { error: 'Failed to delete' };
	} catch (error: any) {
		return { error: error.message || 'Unknown error' };
	}
};
