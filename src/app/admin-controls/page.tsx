
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Message from '@/components/Message';
import Link from 'next/link';
import MenuItem from '@/components/MenuItem';
import { ShieldCheck, LayoutGrid, Newspaper } from 'lucide-react';

export default async function AdminControls() {
	const session = await getServerSession(authOptions);

	if (session?.user?.role === 'admin' || session?.user?.role === 'superAdmin') {
		return (
			<section className='mx-auto max-w-5xl px-6 py-10'>
				<h2 className='text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-8'>
					Admin
				</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
					{session.user.role === 'superAdmin' && (
						<Link href='/admin-controls/admin-create-delete'>
							<MenuItem Icon={ShieldCheck} title='Manage Admins' color='from-purple-500 to-indigo-500' />
						</Link>
					)}
					<Link href='/admin-controls/categories'>
						<MenuItem Icon={LayoutGrid} title='Categories' color='from-teal-400 to-emerald-500' />
					</Link>
					<Link href='/admin-controls/news'>
						<MenuItem Icon={Newspaper} title='News' color='from-orange-400 to-pink-500' />
					</Link>
				</div>
			</section>
		);
	}

	return <Message msg='You are not authorized' />;
}
