'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateHistory(): null {
	const params = useParams() as { newsIdentifier?: string };

	useEffect(() => {
		const saveHistory = async () => {
			if (!params.newsIdentifier) return;

			try {
				await fetch(
					`/api/history/createHistory?newsIdentifier=${params.newsIdentifier}`,
					{ method: 'POST' }
				);
			} catch (error) {
				console.error('Failed to save history:', error);
			}
		};

		saveHistory();
	}, [params.newsIdentifier]);

	return null;
}
