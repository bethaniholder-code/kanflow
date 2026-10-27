'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CreateBoardForm() {
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
         console.log('handleSubmit called, title:', title)
        if (!title.trim()) return
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        console.log('user:', user)
       
        if (!user) { 
            console.log('no user found, aborting')
            setLoading(false)
            return
        }

        const { error } =await supabase
        .from('boards')
        .insert({ title, owner_id: user.id })

        console.log('insert error:', error)

        setLoading(false)

        if (error) {
            console.error(error)
            return
        }

        setTitle('')
        router.refresh()
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input
              type="text"
              value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New board name"
                className="flex-1 px-3 py-2 border rounded"
                />
                <button
                type="submit"
                onClick={() => console.log('button clicked')}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-gray-400"
                >
                    {loading ? 'Creating...' : 'Create'}
                </button>
        </form>
    ) 
}