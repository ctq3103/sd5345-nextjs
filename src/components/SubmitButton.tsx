'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type='submit'
			disabled={pending}
			className={`btn text-white text-md w-full px-6 py-3 rounded-md transition ${
				pending
					? 'bg-gray-500 cursor-not-allowed'
					: 'bg-slate-700 hover:bg-slate-800'
			}`}
		>
			{pending ? 'Submitting...' : 'Submit'}
		</button>
	);
}
