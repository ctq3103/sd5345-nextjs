'use client';

import {
	createAdminAction,
	deleteAdminAction,
	fetchAdminAction,
} from '@/actions/admin';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import Message from '@/components/Message';
import Select from '@/components/Select';
import SubmitButton from '@/components/SubmitButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react'; 

interface AdminUser {
	_id: string;
	name: string;
	email: string;
	role: 'admin' | 'superAdmin';
}

export default function AdminCreateDeletePage() {
	const router = useRouter();
	const { status, data: session } = useSession();
	const [adminData, setAdminData] = useState<AdminUser[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedAdminData = await fetchAdminAction();
				setAdminData(fetchedAdminData);
			} catch (error) {
				console.error('Failed to fetch admin data', error);
			}
		};
		fetchData();
	}, []);

	if (status === 'loading') return <Loader />;
	if (session?.user?.role !== 'superAdmin')
		return <Message msg='You are not super admin!' />;

	return (
		<div className='min-h-screen bg-gray-50 py-10 px-4'>
			<div className='max-w-xl mx-auto bg-white shadow-md p-8 rounded-2xl border border-gray-200'>
				<h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>
					Create Admin
				</h2>
				<form
					action={async (formData) => {
						await createAdminAction(formData);
						router.push('/admin-controls');
					}}
					className='flex flex-col gap-4'
				>
					<Input
						typeAttr='email'
						nameAttr='email'
						placeholderAttr='User Email'
						classAttr='w-full'
						requiredAttr
					/>
					<Select
						nameAttr='role'
						requiredAttr
						classAttr='w-full'
						placeholderAttr='Select Role'
						optionsAttr={['admin', 'superAdmin']}
					/>
					<div className='self-center mt-4'>
						<SubmitButton />
					</div>
				</form>
			</div>

			<div className='mt-10 max-w-xl mx-auto'>
				{adminData.length > 0 ? (
					adminData.map((item) => (
						<div
							key={item._id}
							className='flex justify-between items-start bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-4'
						>
							<div className='space-y-1 text-sm text-gray-800'>
								<p className='font-medium'>Name: {item.name}</p>
								<p>Email: {item.email}</p>
								<p>Role: {item.role}</p>
							</div>
							<Trash2
								size={20}
								className='text-red-500 hover:text-red-600 cursor-pointer'
								onClick={() => {
									deleteAdminAction(item.email);
									router.replace('/admin-controls');
								}}
							/>
						</div>
					))
				) : (
					<Message msg='No admins found.' />
				)}
			</div>
		</div>
	);
}
