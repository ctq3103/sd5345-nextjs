'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface BookmarkButtonProps {
	newsIdentifier: string;
}

export default function BookmarkButton({ newsIdentifier }: BookmarkButtonProps) {
	const { data: session } = useSession();
	const [bookmarked, setBookmarked] = useState<boolean>(false);

	useEffect(() => {
		const fetchBookmarkStatus = async () => {
			if (!session?.user?.mongoId) return;
			try {
				const res = await fetch(
					`/api/bookmarks/bookmarkStatus?newsIdentifier=${newsIdentifier}`
				);
				const { hasBookmarked } = await res.json();
				setBookmarked(hasBookmarked);
			} catch (error) {
				console.error('Failed to fetch bookmark status:', error);
			}
		};
		fetchBookmarkStatus();
	}, [newsIdentifier, session]);

	const handleBookmark = async () => {
		if (!session?.user?.mongoId) return;

		try {
			const url = bookmarked
				? `/api/bookmarks/removeBookmark?newsIdentifier=${newsIdentifier}`
				: `/api/bookmarks/doBookmark?newsIdentifier=${newsIdentifier}`;
			const method = bookmarked ? 'DELETE' : 'POST';

			const res = await fetch(url, { method });
			if (res.ok) {
				setBookmarked(!bookmarked);
			}
		} catch (error) {
			console.error('Bookmark toggle error:', error);
		}
	};

	return (
		<button
			className='transition hover:scale-110'
			onClick={handleBookmark}
			title={bookmarked ? 'Remove bookmark' : 'Add to bookmarks'}
		>
			{bookmarked ? (
				<BookmarkCheck className='w-6 h-6 text-primary' />
			) : (
				<Bookmark className='w-6 h-6 text-gray-400' />
			)}
		</button>
	);
}
