'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'


type Props = {
  onBoardCreated: () => void
}

export default function CreateBoardForm({ onBoardCreated }: Props) {
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const [color, setColor] = useState('#5046e5')
    

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
        .insert({ title, owner_id: user.id, color })

        console.log('insert error:', error)

        setLoading(false)

        if (error) {
            console.error(error)
            return
        }

        setTitle('')
        onBoardCreated()
    }
    

return (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 max-w-lg">
    <h2 className="text-white/70 text-sm font-medium mb-3">Create a new board</h2>
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Board name"
        className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder:text-white/30 border border-white/10 outline-none focus:border-indigo-400 text-sm"
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['#5046e5', '#e53e3e', '#38a169', '#d69e2e', '#3182ce', '#805ad5'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg disabled:bg-gray-600"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  </div>
)
}