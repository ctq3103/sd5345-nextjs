'use client';

import {
  fetchCategoryAction,
  updateCategoryAction,
} from '@/actions/category';
import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import Textarea from '@/components/Textarea';
import { useParams, useRouter } from 'next/navigation';
import {  useEffect, useRef, useState } from 'react';

interface CategoryData {
  name: string;
  description: string;
}

export default function UpdateCategory() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const failedRef = useRef<HTMLParagraphElement>(null);
  const [_, setSelectedFile] = useState<File | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData>({
    name: '',
    description: '',
  });

  const router = useRouter();
  const params = useParams();
  const categoryId = params?.categoryId as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategoryData = await fetchCategoryAction(categoryId);
        setCategoryData({
          name: fetchedCategoryData.name || '',
          description: fetchedCategoryData.description || '',
        });
      } catch (_) {
        if (failedRef.current) {
          failedRef.current.textContent = 'Error fetching category data';
        }
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  return (
    <div className='grid place-items-center min-h-screen bg-slate-50'>
      <form
        ref={formRef}
        action={async (formData: FormData) => {
          if (successRef.current) successRef.current.textContent = '';
          if (failedRef.current) failedRef.current.textContent = '';

          formData.append('categoryId', categoryId);
          const result = await updateCategoryAction(formData);

          if (result?.success) {
            formRef.current?.reset();
            setSelectedFile(null);
            if (successRef.current) successRef.current.textContent = 'Updated successfully!';
            router.replace('/admin-controls');
          } else {
            if (failedRef.current) failedRef.current.textContent = result?.error ?? 'Update failed.';
          }
        }}
        className='w-[90%] sm:w-[580px] shadow-xl p-8 rounded-lg flex flex-col gap-4 bg-white border'
      >
        <h2 className='text-slate-800 font-bold text-2xl mb-4 self-center'>
          Update Category
        </h2>

        <Input
          typeAttr='text'
          nameAttr='name'
          placeholderAttr='Category Name'
          requiredAttr={true}
          classAttr='w-full'
          value={categoryData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCategoryData({ ...categoryData, name: e.target.value })
          }
        />

        <Textarea
          nameAttr='description'
          placeholderAttr='Description'
          requiredAttr={true}
          classAttr='w-full resize-none'
          value={categoryData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCategoryData({ ...categoryData, description: e.target.value })
          }
        />

        {/* <FileInput
          nameAttr='thumbnailImage'
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
        /> */}

        <div className='self-center mt-4'>
          <SubmitButton />
        </div>

        <p ref={successRef} className='text-green-600 text-center font-bold'></p>
        <p ref={failedRef} className='text-red-600 text-center font-bold'></p>
      </form>
    </div>
  );
}
