'use client';

import { fetchAllCategoryAction } from '@/actions/category';
import { addNewsAction } from '@/actions/news';
import FileInput from '@/components/FileInput';
import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import Textarea from '@/components/Textarea';
import TipTap from '@/components/TipTap';
import { useSession } from 'next-auth/react';
import { SetStateAction, useEffect, useRef, useState } from 'react';

interface ICategory {
  _id: string;
  name: string;
}

export default function AddNews() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const successRef = useRef<HTMLParagraphElement | null>(null);
  const failedRef = useRef<HTMLParagraphElement | null>(null);
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [content, setContent] = useState<string>('');
  const { status, data: session } = useSession();

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const fetchedCategoryData = await fetchAllCategoryAction();
        setCategories(fetchedCategoryData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryData();
  }, []);

  return (
    <div className='grid place-items-center min-h-screen py-24 bg-[#f5f7fa] dark:bg-[#1c1c1c] px-4'>
      <form
        ref={formRef}
        action={async (formData) => {
          if (!session?.user?.mongoId) return;
          successRef.current!.textContent = '';
          failedRef.current!.textContent = '';

          formData.append('description', content);
          formData.append('author', session.user.mongoId);

          const data = await addNewsAction(formData);
          if (data?.success) {
            formRef.current?.reset();
            // setSelectedFile(null);
            successRef.current!.textContent = '✅ Created successfully!';
          } else {
            failedRef.current!.textContent = data?.error;
          }
        }}
        className='w-full max-w-2xl shadow-2xl p-8 rounded-xl flex flex-col gap-6 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white'
      >
        <h2 className='text-3xl font-bold text-center'>📰 Create News</h2>

        <Input
          typeAttr='text'
          nameAttr='title'
          placeholderAttr='Enter the news title'
          requiredAttr={true}
          classAttr='w-full'
        />

        <Textarea
          nameAttr='shortDescription'
          placeholderAttr='Short Description'
          requiredAttr={true}
          classAttr='w-full bg-white dark:bg-zinc-800 text-gray-800 dark:text-white'
        />

        <div>
          <label className='block mb-2 text-sm font-semibold'>Select Category</label>
          <div className='flex flex-wrap gap-4'>
            {categories.map((item) => (
              <label
                key={item._id}
                className='flex items-center gap-2 text-sm bg-gray-100 dark:bg-zinc-800 px-3 py-2 rounded-full'
              >
                <input
                  type='checkbox'
                  className='accent-blue-500'
                  name='categories'
                  value={item._id}
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>

        {/* <FileInput
          nameAttr='thumbnailImage'
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
        /> */}

        <TipTap content={content} onChange={(newContent: SetStateAction<string>) => setContent(newContent)} />

        <div className='self-center mt-4'>
          <SubmitButton />
        </div>

        <p
          ref={successRef}
          className='text-green-600 text-center font-bold text-lg'
        ></p>
        <p
          ref={failedRef}
          className='text-red-600 text-center font-bold text-lg'
        ></p>
      </form>
    </div>
  );
}
