// components/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useCallback } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

// Custom Image extension with resizing
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes) => {
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        renderHTML: (attributes) => {
          return { height: attributes.height };
        },
      },
    };
  },
});

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      CustomImage.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto cursor-pointer",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url, width: 400 }).run();
    }
  }, [editor]);

  const setImageSize = useCallback(
    (size: string) => {
      if (editor) {
        const { state } = editor;
        const { selection } = state;
        const node = state.doc.nodeAt(selection.from);

        if (node && node.type.name === "image") {
          editor
            .chain()
            .focus()
            .updateAttributes("image", { width: size, height: null })
            .run();
        } else {
          alert("Please click on an image first");
        }
      }
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 border-b p-2 flex gap-2 flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("bold") ? "bg-gray-800 text-white" : "bg-white"
          }`}
          type="button"
        >
          <strong>B</strong>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("italic") ? "bg-gray-800 text-white" : "bg-white"
          }`}
          type="button"
        >
          <em>I</em>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("bulletList")
              ? "bg-gray-800 text-white"
              : "bg-white"
          }`}
          type="button"
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("orderedList")
              ? "bg-gray-800 text-white"
              : "bg-white"
          }`}
          type="button"
        >
          1. List
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1 rounded ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-800 text-white"
              : "bg-white"
          }`}
          type="button"
        >
          H2
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-3 py-1 rounded ${
            editor.isActive("heading", { level: 3 })
              ? "bg-gray-800 text-white"
              : "bg-white"
          }`}
          type="button"
        >
          H3
        </button>

        <div className="border-l mx-2"></div>

        <button
          onClick={addImage}
          className="px-3 py-1 rounded bg-white"
          type="button"
        >
          🖼️ Add Image
        </button>

        <button
          onClick={() => setImageSize("300")}
          className="px-3 py-1 rounded bg-white text-sm"
          type="button"
        >
          Small
        </button>

        <button
          onClick={() => setImageSize("500")}
          className="px-3 py-1 rounded bg-white text-sm"
          type="button"
        >
          Medium
        </button>

        <button
          onClick={() => setImageSize("800")}
          className="px-3 py-1 rounded bg-white text-sm"
          type="button"
        >
          Large
        </button>

        <button
          onClick={() => setImageSize("100%")}
          className="px-3 py-1 rounded bg-white text-sm"
          type="button"
        >
          Full Width
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}

// Example usage in a page:
// 'use client';
// import { useState } from 'react';
// import RichTextEditor from '@/components/RichTextEditor';
//
// export default function CreateBlog() {
//   const [content, setContent] = useState('');
//
//   const handleSave = () => {
//     console.log('Blog content:', content);
//     // Save to your database
//   };
//
//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-4">Create New Blog</h1>
//       <RichTextEditor content={content} onChange={setContent} />
//       <button
//         onClick={handleSave}
//         className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
//       >
//         Save Blog
//       </button>
//     </div>
//   );
// }
