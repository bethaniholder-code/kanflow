'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
    boardId: string
    onListAdded: (newList: { id: string; title: string; position: number; cards: [] }) => void
}

export default function AddListForm({ boardId, onListAdded }: Props) {
   const [title, setTitle] = useState('')
   const [loading, setLoading] = useState(false)
   const supabase = createClient()
   
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     if (!title.trim()) return
     setLoading(true)

     const { data, error } = await supabase
       .from('lists') 
       .insert({ title, board_id: boardId, position: Date.now() })
       .select('id, title, position')
       .single()

    setLoading(false)

    if (error) {
        console.error('error creating list:', error)
        return 
    }

    onListAdded({ ...data, cards: [] })
    setTitle('')
   }

   return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100/20 rounded-lg p-3 w-64 flex-shrink-0"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="list name"
        className="w-full px-2 py-1 rounded text-gray-900 text-sm mb-2"
      />
      <button 
        type="submit"
        disabled={loading}
        className="bg-white text-indigo-600 text-sm px-3 py-1 rounded font-medium disabled:opacity-50"
        >
            {loading ? 'Adding...' : 'Add List'}
        </button>
      </form>    
   )
} 