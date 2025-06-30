'use server';

//import fileUploader from '@/lib/fileUploader';
import { connectMongoDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Joi from 'joi';

export interface CategoryType {
  _id: string;
  name: string;
  description: string;
  thumbnailURL: string;
}

const joiCategoryCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  thumbnailURL: Joi.string().required(),
});

const joiCategoryUpdateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  thumbnailURL: Joi.string().allow('').optional(),
});

// ========== [1] Fetch All ==========
export const fetchAllCategoryAction = async (): Promise<CategoryType[]> => {
  try {
    await connectMongoDB();
    const result = await Category.find();
    return JSON.parse(JSON.stringify(result));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch categories');
  }
};

// ========== [2] Fetch One ==========
export const fetchCategoryAction = async (_id: string): Promise<CategoryType> => {
  try {
    await connectMongoDB();
    const result = await Category.findOne({ _id });
    return JSON.parse(JSON.stringify(result));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch category');
  }
};

// ========== [3] Create ==========
export const createCategoryAction = async (
  formData: FormData
): Promise<{ success?: true; error?: string }> => {
  try {
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const thumbnailImage = formData.get('thumbnailImage') as File | null;

    // if (
    //   !thumbnailImage ||
    //   !['image/jpeg', 'image/png'].includes(thumbnailImage.type)
    // ) {
    //   throw new Error('Image is required and must be JPEG or PNG.');
    // }

    // const thumbnailURL = await fileUploader(thumbnailImage, 'images');

    const thumbnailURL = 'https://picsum.photos/600/400'

    const { error } = joiCategoryCreateSchema.validate({
      name,
      description,
      thumbnailURL,
    });

    if (error) {
      throw new Error(error.details[0].message);
    }

    await connectMongoDB();

    const result = await Category.create({ name, description, thumbnailURL });

    if (result) return { success: true };
    return { error: 'Failed to create category' };
  } catch (error: any) {
    return { error: error.message };
  }
};

// ========== [4] Update ==========
export const updateCategoryAction = async (
  formData: FormData
): Promise<{ success?: true; error?: string }> => {
  try {
    const _id = formData.get('categoryId')?.toString();
    const name = formData.get('name')?.toString() ?? '';
    const description = formData.get('description')?.toString() ?? '';
    const thumbnailImage = formData.get('thumbnailImage') as File | null;

    let thumbnailURL: string | undefined;

    if (
      thumbnailImage &&
      thumbnailImage.size > 0 &&
      ['image/jpeg', 'image/png'].includes(thumbnailImage.type)
    ) {
      thumbnailURL = 'https://picsum.photos/600/400'
    }

    const { error } = joiCategoryUpdateSchema.validate({
      name,
      description,
      thumbnailURL,
    });

    if (error) {
      throw new Error(error.details[0].message);
    }

    await connectMongoDB();

    const existingCategory = await Category.findOne({ _id });

    if (!existingCategory) {
      throw new Error('Category does not exist!');
    }

    existingCategory.name = name;
    existingCategory.description = description;

    if (thumbnailURL) {
      existingCategory.thumbnailURL = thumbnailURL;
    }

    const result = await existingCategory.save();

    if (result) return { success: true };
    return { error: 'Failed to update category' };
  } catch (error: any) {
    return { error: error.message };
  }
};

// ========== [5] Delete ==========
export const deleteCategoryAction = async (
  _id: string
): Promise<{ success?: true; error?: string }> => {
  try {
    await connectMongoDB();
    const result = await Category.findByIdAndDelete(_id);
    if (result) return { success: true };
    return { error: 'Failed to delete category' };
  } catch (error: any) {
    return { error: error.message };
  }
};
