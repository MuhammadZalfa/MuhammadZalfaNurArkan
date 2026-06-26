"use client"

import { useCallback, useRef } from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import LinkExtension from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { Bold, Italic, Heading2, List, ListOrdered, Link, Link2Off } from "lucide-react"
import { cn } from "@/lib/utils"

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minRows?: number
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Masukkan URL", previousUrl || "https://")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  const buttons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      label: "Heading",
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      label: "Ordered List",
    },
    {
      icon: Link,
      action: setLink,
      active: editor.isActive("link"),
      label: "Link",
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-input bg-muted/30 rounded-t-xl">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={btn.action}
          className={cn(
            "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            btn.active && "bg-muted text-foreground",
          )}
          title={btn.label}
        >
          <btn.icon className="h-4 w-4" />
        </button>
      ))}
      {editor.isActive("link") && (
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-auto"
          title="Hapus Link"
        >
          <Link2Off className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export function RichEditor({ value, onChange, placeholder, minRows = 6 }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || "Tulis deskripsi..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral dark:prose-invert max-w-none px-4 py-3 focus:outline-none min-h-[calc(1.5rem*var(--min-rows))]",
        style: `--min-rows: ${minRows}`,
      },
    },
    immediatelyRender: false,
  })

  if (!editor) return null

  return (
    <div
      className={cn(
        "rounded-xl border border-input bg-background transition-all duration-200",
        "focus-within:ring-2 focus-within:ring-ring focus-within:border-primary",
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
