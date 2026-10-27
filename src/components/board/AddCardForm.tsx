'use client'

import { useState } from 'react' 
import { createClient } from '@/lib/supabase/client'

type Props = {
    listId: string
    onCardAdded: (newCard: { id: string; title: string; position: number; list_id: string}) => void
}

export default function AddCardFrom({ listId, onCardAdded }: Props) {
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return
        setLoading(true)

        const { data, error } = await supabase
            .from('cards') 
            .insert({ title, list_id: listId, position: Date.now() })
            .select('id, title, position,list_id')
            .single()

        setLoading(false)

        if (error) {
            console.error('error creating card:', error)
            return
        }
        
        onCardAdded(data)
        setTitle('')
        setOpen(false)
    }
    if (!open) {
        return (
            <button
              onClick={() => setOpen(true)}
              className="text-gray-500 hover:text-gray-700 text-sm text-left w-full pt-1"
              >
                + Add a card
              </button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="mt-2">
            <textarea
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="Enter a title for this card..."
               className="w-full px-2 py-1 rounded text-gray-900 text-sm resize-none"
               rows={3}
               autoFocus
            />
            <div className="flex gap-2 mt-1">
                <button 
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white text-sm px-3 py-1 rounded disabled:opacity-50"
               >
                {loading ? ' Adding...' : 'Add card'}
               </button>
               <button 
                type="button"
                onClick={() => { 
                    setOpen(false)
                    setTitle('')
                }}
                className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1"
                >
                    Cancel
                </button>  
            </div>
        </form>
    )
}