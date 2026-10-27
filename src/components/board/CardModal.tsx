'use client'

import { useState } from 'react'

type Props = {
    card: {
        id: string
        title: string 
        description: string | null
    }
    onClose: () => void
    onSave: (cardId: string, description: string) => void
}

export default function CardModle({ card, onClose, onSave }: Props) {
    const [description, setDescription] = useState(card.description || '')

    return (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description..."
        className="w-full h-32 p-2 border rounded text-sm text-gray-700 resize-none outline-none"
      />
      <button
        onClick={() => {
          onSave(card.id, description)
          onClose()
        }}
        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  </div>
  )
}