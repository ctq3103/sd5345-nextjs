'use client';

import { deleteNewsAction } from '@/actions/news';
import DeleteConfirm from '@/components/DeleteConfirm';
import Loader from '@/components/Loader';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DeleteNews() {
  const params = useParams<{ newsId: string }>();
  const { status, data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doRedirect = async () => {
      if (!session?.user || session?.user?.role !== 'superAdmin') {
        router.replace('/admin-controls');
      } else {
        setLoading(false);
      }
    };
    doRedirect();
  }, [session, router]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <DeleteConfirm
        ModelType='News'
        deleteAction={async () => { await deleteNewsAction(params.newsId as string)}}
        />
    </div>
  );
}
