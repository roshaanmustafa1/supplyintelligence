'use client'

import { useRef, useState } from 'react'
import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Unlink,
  ImagePlus,
  Minus,
  Undo2,
  Redo2,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
}

interface ToolbarButtonProps {
  label: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}

function ToolbarButton({ label, onClick, active, disabled, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        'flex size-8 items-center justify-center rounded-lg text-dashboard-muted-foreground transition-colors hover:bg-dashboard-accent hover:text-dashboard-foreground disabled:opacity-40',
        active && 'bg-brand-blue/10 text-brand-blue'
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-dashboard-border" aria-hidden="true" />
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      link: e.isActive('link'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })

  function setLink() {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL (https://...)', previous ?? 'https://')
    if (url === null) return
    if (url.trim() === '' || url.trim() === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    if (!/^(https?:\/\/|mailto:)/i.test(url.trim())) {
      window.alert('Links must start with http://, https:// or mailto:')
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setIsUploading(true)
    setUploadError(null)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/uploads/image', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      const alt = window.prompt('Describe the image (alt text, for accessibility)', file.name.replace(/\.[^.]+$/, '')) ?? ''
      editor.chain().focus().setImage({ src: data.url, alt }).run()
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="border-b border-dashboard-border bg-dashboard-accent/30 p-1.5">
      <div className="flex flex-wrap items-center gap-0.5" role="toolbar" aria-label="Text formatting">
        <ToolbarButton label="Undo" disabled={!state.canUndo} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Redo" disabled={!state.canRedo} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Heading 2" active={state.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Heading 3" active={state.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Bold" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Underline" active={state.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <Underline className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Strikethrough" active={state.strike} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Bulleted list" active={state.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={state.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Quote" active={state.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Divider line" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Add link" active={state.link} onClick={setLink}>
          <Link2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Remove link"
          disabled={!state.link}
          onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
        >
          <Unlink className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Insert image from your computer" disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
          {isUploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleImageFile}
          className="hidden"
          aria-label="Upload image into article"
        />
      </div>
      {uploadError && <p className="px-2 pt-1 text-dashboard-caption text-destructive">{uploadError}</p>}
    </div>
  )
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } },
      }),
      Image,
      Placeholder.configure({ placeholder: 'Start drafting your strategic analysis...' }),
    ],
    content: value,
    editorProps: {
      attributes: {
        'aria-label': 'Article body',
        class:
          'min-h-[360px] p-5 text-sm leading-relaxed text-dashboard-foreground focus:outline-none ' +
          '[&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold ' +
          '[&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold ' +
          '[&_h4]:mt-4 [&_h4]:mb-1 [&_h4]:font-semibold ' +
          '[&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 ' +
          '[&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-blue/50 [&_blockquote]:pl-4 [&_blockquote]:italic ' +
          '[&_a]:text-brand-blue [&_a]:underline [&_hr]:my-4 [&_hr]:border-dashboard-border ' +
          '[&_img]:my-3 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl ' +
          '[&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:float-left ' +
          '[&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:text-dashboard-muted-foreground/60 ' +
          "[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? '' : e.getHTML()),
  })

  if (!editor) {
    return <div className="min-h-[360px] rounded-xl border border-dashboard-input bg-dashboard-background" />
  }

  return (
    <div className="overflow-hidden rounded-xl border border-dashboard-input bg-dashboard-background focus-within:border-brand-blue">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
