'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Board = {
  id: string
  title: string
  owner_id: string
  color: string | null
}

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    async function fetchBoards() {
      const { data, error } = await supabase
        .from('boards')
        .select('id, title, owner_id, color')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('fetch error:', error)
      } else {
        setBoards(data || [])
      }

      setLoading(false)
    }

    fetchBoards()
  }, [])

  const handleDelete = async (boardId: string) => {
  const confirmed = window.confirm('Delete this board?')
  if (!confirmed) return

  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('id', boardId)

  if (error) {
    console.error('delete error:', error)
    return
  }

  setBoards((prev) => prev.filter((b) => b.id !== boardId))
}

const handleEdit = async (boardId: string) => {
  if (!editTitle.trim()) return

  const { error } = await supabase
    .from('boards')
    .update({ title: editTitle })
    .eq('id', boardId)

  if (error) {
    console.error('edit error:', error)
    return
  }

  setBoards((prev) =>
    prev.map((b) => (b.id === boardId ? { ...b, title: editTitle } : b))
  )
  setEditingId(null)
}

  if (loading) return <p className="text-gray-400">Loading boards...</p>
  if (boards.length === 0) return (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="text-5xl mb-4">🗂️</div>
    <h2 className="text-white font-semibold text-lg mb-1">No boards yet</h2>
    <p className="text-gray-400 text-sm max-w-xs">
      Create your first board using the form above to start organizing your work.
    </p>
  </div>
)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {boards.map((board) => (
        <div
        style={{ backgroundColor: board.color || '#5046e5' }}
        key={board.id}
  className="relative group cursor-pointer rounded-lg p-4 h-24 flex items-end"
  onClick={() => editingId !== board.id && router.push(`/board/${board.id}`)}
>
  {editingId === board.id ? (
    <div
      className="flex flex-col gap-2 w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="text"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        className="w-full px-2 py-1 rounded text-gray-900 text-sm"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(board.id)}
          className="bg-white text-indigo-600 text-xs px-2 py-1 rounded font-medium"
        >
          Save
        </button>
        <button
          onClick={() => setEditingId(null)}
          className="bg-black/20 text-white text-xs px-2 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <>
      <span className="text-white font-medium">{board.title}</span>
      <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setEditingId(board.id)
            setEditTitle(board.title)
          }}
          className="bg-black/30 hover:bg-black/50 text-white text-xs px-2 py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete(board.id)
          }}
          className="bg-black/30 hover:bg-black/50 text-white text-xs px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </>
  )}
</div>
      ))}
    </div>
  )
}