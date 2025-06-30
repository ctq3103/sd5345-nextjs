'use client';

import { useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo2,
  Redo2,
} from 'lucide-react';
import { Editor } from '@tiptap/react';

interface ToolbarProps {
  editor: Editor | null;
  content?: string;
  description?: string;
}

export default function Toolbar({ editor, description }: ToolbarProps) {
  useEffect(() => {
    if (editor && description) {
      editor.commands.setContent(description);
    }
  }, [description, editor]);

  if (!editor) return null;

  const buttons = [
    {
      icon: Bold,
      isActive: editor.isActive('bold'),
      command: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      isActive: editor.isActive('italic'),
      command: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: Underline,
      isActive: editor.isActive('underline'),
      command: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      icon: Strikethrough,
      isActive: editor.isActive('strike'),
      command: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      icon: Heading2,
      isActive: editor.isActive('heading', { level: 2 }),
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: List,
      isActive: editor.isActive('bulletList'),
      command: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      isActive: editor.isActive('orderedList'),
      command: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: Quote,
      isActive: editor.isActive('blockquote'),
      command: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: Code,
      isActive: editor.isActive('code'),
      command: () => editor.chain().focus().setCode().run(),
    },
    {
      icon: Undo2,
      isActive: false,
      command: () => editor.chain().focus().undo().run(),
    },
    {
      icon: Redo2,
      isActive: false,
      command: () => editor.chain().focus().redo().run(),
    },
  ];

  return (
    <div className='flex flex-wrap items-center gap-2 border border-gray-300 px-4 py-3 rounded-t-md bg-white dark:bg-slate-800'>
      {buttons.map(({ icon: Icon, command, isActive }, index) => (
        <button
          key={index}
          type='button'
          onClick={(e) => {
            e.preventDefault();
            command();
          }}
          className={`p-2 rounded-md transition ${
            isActive
              ? 'bg-primary text-white'
              : 'text-primary hover:bg-primary/10'
          }`}
        >
          <Icon className='w-5 h-5' />
        </button>
      ))}
    </div>
  );
}
