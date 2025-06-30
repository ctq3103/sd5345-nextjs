'use client';

import { fetchAllCategoryAction } from '@/actions/category';
import {
  fetchNewsAction,
  updateNewsAction,
} from '@/actions/news';
import FileInput from '@/components/FileInput';
import Input from '@/components/Input';
import SubmitButton from '@/components/SubmitButton';
import Textarea from '@/components/Textarea';
import TipTap from '@/components/TipTap';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Category {
  _id: string;
  name: string;
}

interface NewsData {
  title: string;
  shortDescription: string;
  categories: string[];
}

export default function UpdateNews() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const failedRef = useRef<HTMLParagraphElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();

  const [newsData, setNewsData] = useState<NewsData>({
    title: '',
    shortDescription: '',
    categories: [],
  });

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const fetched = await fetchNewsAction(params.newsId as string);
        setNewsData({
          title: fetched.title,
          shortDescription: fetched.shortDescription,
          categories: fetched.categories.map((cat: Category) => cat._id),
        });
        setContent(fetched.description);
        setDescription(fetched.description);
      } catch (err) {
        console.error(err);
      }
    };

    if (params.newsId) fetchNewsData();
  }, [params.newsId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchAllCategoryAction();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen py-20 flex justify-center bg-gray-100">
      <form
        ref={formRef}
        action={async (formData) => {
          successRef.current!.textContent = '';
          failedRef.current!.textContent = '';

          formData.append('newsId', params.newsId as string);
          formData.append('description', content);
          formData.append(
            'author',
            JSON.stringify({
              _id: session?.user?.mongoId,
              name: session?.user?.name,
            })
          );

          newsData.categories.forEach((cat) => {
            const matched = categories.find((c) => c._id === cat);
            if (matched) {
              formData.append('categories', JSON.stringify(matched));
            }
          });

          const result = await updateNewsAction(formData);
          if (result?.success) {
            formRef.current?.reset();
            setSelectedFile(null);
            successRef.current!.textContent = '✅ News updated successfully!';
            router.push('/admin-controls');
          } else {
            failedRef.current!.textContent = result?.error || '❌ Update failed.';
          }
        }}
        className="bg-white w-full max-w-2xl p-8 rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Update News</h2>

        <Input
          typeAttr="text"
          nameAttr="title"
          placeholderAttr="Enter the news title"
          requiredAttr
          classAttr="w-full"
          value={newsData.title}
          onChange={(e) => setNewsData({ ...newsData, title: e.target.value })}
        />

        <Textarea
          nameAttr="shortDescription"
          placeholderAttr="Short Description"
          requiredAttr
          classAttr="w-full resize-none"
          value={newsData.shortDescription}
          onChange={(e) =>
            setNewsData({ ...newsData, shortDescription: e.target.value })
          }
        />

        <div className="space-y-2">
          <p className="font-medium text-gray-700">Select Categories:</p>
          <div className="flex flex-wrap gap-4">
            {categories.map((item) => (
              <label key={item._id} className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={newsData.categories.includes(item._id)}
                  className="checkbox checkbox-primary"
                  name="categories"
                  value={item._id}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...newsData.categories, item._id]
                      : newsData.categories.filter((id) => id !== item._id);
                    setNewsData({ ...newsData, categories: updated });
                  }}
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>

        {/* <FileInput
          nameAttr="thumbnailImage"
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        /> */}

        <TipTap
          content={content}
          onChange={(value) => setContent(value)}
          description={description}
        />

        <div className="flex justify-center mt-4">
          <SubmitButton />
        </div>

        <p ref={successRef} className="text-green-600 text-center font-semibold"></p>
        <p ref={failedRef} className="text-red-600 text-center font-semibold"></p>
      </form>
    </div>
  );
}
