'use client';

import { deleteCategoryAction } from '@/actions/category';
import DeleteConfirm from '@/components/DeleteConfirm';
import Loader from '@/components/Loader';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Params {
  categoryId: string;
}

export default function DeleteCategory() {
  const { categoryId } = useParams();
  const { status, data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doRedirect = () => {
      if (!session?.user || session.user.role !== 'superAdmin') {
        router.replace('/admin-controls');
      } else {
        setLoading(false);
      }
    };

    doRedirect();
  }, [session, router]);

  if (loading || status === 'loading') return <Loader />;

  return (
    <DeleteConfirm
        ModelType='Category'
        deleteAction={async () => {
            const res = await deleteCategoryAction(categoryId as string);
            if (!res.success) {
            console.error(res.error);
            }
        }}
        />
    )
}
