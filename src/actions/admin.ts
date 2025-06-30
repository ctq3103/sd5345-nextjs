'use server';

import { connectMongoDB } from '@/lib/mongodb';
import User from '@/models/User';
import Joi from 'joi';

const joiAdminSchema = Joi.object({
	email: Joi.string().email().min(5).required(),
	role: Joi.string().valid('admin', 'superAdmin').required(),
});

interface AdminUser {
    _id: string;
	name: string;
	email: string;
	role: 'admin' | 'superAdmin';
}

export const fetchAdminAction = async (): Promise<AdminUser[]> => {
	try {
		await connectMongoDB();
		const admins = await User.find({ role: 'admin' }).select('name email role');
		return JSON.parse(JSON.stringify(admins));
	} catch (err) {
		console.error('[fetchAdminAction] Failed:', err);
		throw new Error('Failed to fetch admin users.');
	}
};

export const createAdminAction = async (
	formData: FormData
): Promise<{ success?: boolean; error?: string }> => {
	try {
		const email = formData.get('email')?.toString() ?? '';
		const role = formData.get('role')?.toString() ?? '';

		const { error } = joiAdminSchema.validate({ email, role });
		if (error) {
			return { error: error.details[0]?.message || 'Validation error' };
		}

		await connectMongoDB();

		const user = await User.findOne({ email });
		if (!user) {
			return { error: 'User does not exist.' };
		}

		user.role = role as 'admin' | 'superAdmin';
		await user.save();

		return { success: true };
	} catch (err) {
		console.error('[createAdminAction] Error:', err);
		return {
			error: err instanceof Error ? err.message : 'Unexpected error occurred.',
		};
	}
};

export const deleteAdminAction = async (email: string): Promise<void> => {
	try {
		await connectMongoDB();

		const user = await User.findOne({ email });
		if (!user) {
			throw new Error('User does not exist.');
		}

		user.role = 'user';
		await user.save();
	} catch (err) {
		console.error('[deleteAdminAction] Error:', err);
		throw new Error(
			err instanceof Error ? err.message : 'Failed to delete admin.'
		);
	}
};
