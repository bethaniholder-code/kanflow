'use client'

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from 'react'

type Props = {
    id: string
    title: string
    onDelete: (id: string) => void
    onEdit: (id: string, newTitle: string) => void
    onOpen: () => void 
} 

export default function SortableCard({ id, title, onDelete, onEdit, onOpen }: Props) {
    const {
        attributes, 
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(title)

    const style = {
        transform : CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
             onPointerUp={onOpen}
            className="relative group bg-white rounded p-2 text-sm text-gray-800 shadow-sm cursor-grab active:cursor-grabbing"
            >

                {isEditing ? (
                   <input
                   value={editValue}
                   onChange={(e) => setEditValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onBlur={() => {
                      onEdit(id, editValue)
                      setIsEditing(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onEdit(id, editValue)
                        setIsEditing(false)
                      }
                    }}
                    className="w-full text-sm text-gray-800 outline-none"
                    autoFocus
                    />
                  ) : (
                  <span>{editValue}</span>
                  )}
                
                <button
                  onClick={(e) =>{
                    e.stopPropagation()
                    onDelete(id)
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 hidden group-hover:flex bg-gray-200 hover:bg-red-200 hover:text-red-600 text-gray-400 text-xs w-5 h-5 rounded item-center justify-center"
                  >
                    x
                  </button>
                  <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditing(true)
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute top-1 right-6 hidden group-hover:flex bg-gray-200 hover:bg-blue-200 hover:text-blue-600 text-gray-400 text-xs w-5 h-5 rounded items-center justify-center"
>
  ✎
</button>
        </div>
    )
}