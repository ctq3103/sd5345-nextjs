'use client';

import { EditorContent, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Toolbar from './Toolbar';

interface TipTapProps {
  onChange: (html: string) => void;
  content: string;
  description?: string;
}

export default function TipTap({ onChange, content, description }: TipTapProps) {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    editorProps: {
      attributes: {
        class:
          'flex flex-col px-4 py-3 justify-start min-h-80 border border-gray-300 text-gray-800 bg-white items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-br-md rounded-bl-md outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
    autofocus: false,
    immediatelyRender: false,
  });

  return (
    <div className="w-full mt-6">
      <Toolbar editor={editor as Editor} content={content} description={description} />
      <EditorContent style={{ whiteSpace: 'pre-line' }} editor={editor} />
    </div>
  );
}