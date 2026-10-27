'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AddListForm from '@/components/board/AddListForm'
import AddCardForm from '@/components/board/AddCardForm'
import { DndContext, DragEndEvent, DragOverEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import SortableCard from '@/components/board/SortableCard'
import DroppableList from '@/components/board/DroppableList'
import CardModal from '@/components/board/CardModal'


type Card = {
  id: string
  title: string
  position: number
  list_id: string
  description: string | null 
}

type List = {
  id: string
  title: string
  position: number
  cards: Card[]
}

export default function BoardPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [boardTitle, setBoardTitle] = useState('')
  const [editingListId, setEditingListId] = useState<string | null>(null)
  const [editingListTitle, setEditingListTitle] = useState('')
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)


  const handleListAdded = (newList: List) => {
    setLists((prev) => [...prev, newList])
  }

  

  const handleCardAdded = (newCard: Card, listId: string) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      )
    )
  }

  const handleListDelete = async (listId: string) => {
    const confirmed = window.confirm('Delete this list and all its cards?')
    if (!confirmed) return

    const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', listId)

    if (error) {
      console.error('delete list error:', error)
      return
    }

    setLists((prev) => prev.filter((list) => list.id !== listId))
  }

const handleDragOver = (event: DragOverEvent) => {
  const { active, over } = event
  if (!over) return

  const activeId = active.id as string
  const overId = over.id as string

  if (activeId === overId) return

  const activeList = lists.find((l) => l.cards.some((c) => c.id === activeId))
  const overList = lists.find(
    (l) => l.id === overId || l.cards.some((c) => c.id === overId)
  )

  if (!activeList || !overList) return
  if (activeList.id === overList.id) return
  
  const cardAlreadyInOverList = overList.cards.some((c) => c.id === activeId)
if (cardAlreadyInOverList) return
if (overList.cards.some((c) => c.id === activeId)) return


  setLists((prev) =>
    prev.map((list) => {
      if (list.id === activeList.id) {
        return { ...list, cards: list.cards.filter((c) => c.id !== activeId) }
      }
      if (list.id === overList.id) {
        const draggedCard = activeList.cards.find((c) => c.id === activeId)!
        const overIndex = list.cards.findIndex((c) => c.id === overId)
        const newCards = [...list.cards]
        newCards.splice(overIndex >= 0 ? overIndex : list.cards.length, 0, {
          ...draggedCard,
          list_id: overList.id,  // ← update list_id in state immediately
        })
        return { ...list, cards: newCards }
      }
      return list
    })
  )
}

const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event
  setActiveCard(null)

  if (!over) return

  const activeId = active.id as string
  const overId = over.id as string

  const activeList = lists.find((l) => l.cards.some((c) => c.id === activeId))
  if (!activeList) return

  console.log('drag ended, activeList:', activeList.title)
  console.log('cards in list:', activeList.cards.map(c => ({ title: c.title, list_id: c.list_id })))

  const oldIndex = activeList.cards.findIndex((c) => c.id === activeId)
  const newIndex = activeList.cards.findIndex((c) => c.id === overId)

  if (oldIndex !== newIndex && newIndex !== -1) {
    const reordered = arrayMove(activeList.cards, oldIndex, newIndex)
    setLists((prev) =>
      prev.map((list) =>
        list.id === activeList.id ? { ...list, cards: reordered } : list
      )
    )
    activeList.cards = reordered
  }

  lists.forEach((list) => {
    list.cards.forEach((card, index) => {
      supabase
      .from('cards')
      .update({ position: index, list_id: list.id})
      .eq('id', card.id)
      .then(({ error }) => {
        if (error) {
          console.error('update card error:', error)
        }
      })
    })
  })
}

  const handleCardDelete = async (cardId: string, listId: string) => {
    const confirmed = window.confirm('Delete this card?')
    if (!confirmed) return

    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', cardId)

    if (error) {
      console.error('delete card error:', error)
      return
    }

    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, cards: list.cards.filter((c) => c.id !== cardId) }
          : list
      )
    )
  }

  const handleCardEdit = async (cardId: string, newTitle: string) => {
    const { error } = await supabase
      .from('cards')
      .update({ title: newTitle })
      .eq('id', cardId)

    if (error) {
      console.error('update card error:', error)
      return
    }

    setLists((prev) => 
      prev.map((list) => ({
        ...list,
        cards: list.cards.map((card) =>
          card.id === cardId ? {...card, title: newTitle } : card
      ),
      }))
    )
  }

  
  
  const handleListEdit = async (listId: string, newTitle: string) => {
  const { error } = await supabase
    .from('lists')
    .update({ title: newTitle })
    .eq('id', listId)

  if (error) {
    console.error('edit list error:', error)
    return
  }

  setLists((prev) =>
    prev.map((list) =>
      list.id === listId ? { ...list, title: newTitle } : list
    )
  )
}

const handleDescriptionSave = async (cardId: string, description: string) => {
  const { error } = await supabase
  .from('cards')
  .update({ description })
  .eq('id', cardId)
 
 if (error) {
    console.error('update description error:', error)
    return
  }

  setLists((prev) =>
    prev.map((list) => ({
      ...list,
      cards: list.cards.map((card) =>
        card.id === cardId ? { ...card, description } : card
      ),
    }))
  )
}


  useEffect(() => {
    async function fetchBoardData() {
      const { data, error } = await supabase
        .from('lists')
        .select('id, title, position, cards(id, title, position, list_id, description)')
        .eq('board_id', id)
        .order('position', { ascending: true })
        .order('position', { ascending: true, referencedTable: 'cards' })

        const { data: boardData } = await supabase
        .from('boards')
        .select('title')
        .eq('id', id)
        .single()
        
        if (boardData) setBoardTitle(boardData.title)

      if (error) {
        console.error('fetch error:', error)
        setLoading(false)
        return
      }

      setLists((data as List[]) || [])
      setLoading(false)
    }

    fetchBoardData()
  }, [id])

  if (loading) return <div className="p-8 text-white">Loading...</div>

 return (
  <div className="min-h-screen bg-gray-900 p-6">
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => router.push('/boards')}
        className="text-white/70 hover:text-white text-sm"
      >
        ← Back to boards
      </button>
      <h1 className="text-white text-x1 font-semibold">{boardTitle}</h1>
    </div>
    <DndContext
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragStart={(event) => {
        const allCards = lists.flatMap((l) => l.cards)
        const card = allCards.find((c) => c.id === event.active.id)
        setActiveCard(card || null)
      }}
    >
      <div className="flex gap-4 items-start overflow-x-auto pb-4">
        {lists.length === 0 && (
          <p className="text-white/60">No lists yet. Add one to get started.</p>
        )}
        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-gray-100 rounded-lg p-3 w-64 flex-shrink-0"
          >
            <div className="flex items-center justify-between mb-3">
              {editingListId === list.id ? (
  <input
    value={editingListTitle}
    onChange={(e) => setEditingListTitle(e.target.value)}
    onBlur={() => {
     handleListEdit(editingListId!, editingListTitle)
      setEditingListId(null)
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
      handleListEdit(editingListId!, editingListTitle)
        setEditingListId(null)
      }
    }}
    className="font-semibold text-gray-800 outline-none bg-transparent w-full"
    autoFocus
  />
) : (
  <h3
    className="font-semibold text-gray-800 cursor-pointer"
    onClick={() => {
      setEditingListId(list.id)
      setEditingListTitle(list.title)
    }}
  >
    {list.title}
  </h3>
)}
              <button
                onClick={() => handleListDelete(list.id)}
                className="text-gray-400 hover:text-red-500 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <SortableContext
              items={list.cards.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <DroppableList id={list.id}>
              <div className="flex flex-col gap-2">
                {list.cards.map((card) => (
                  <SortableCard
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    onDelete={(cardId) => handleCardDelete(cardId, list.id)}
                    onEdit={(cardId, newTitle) => handleCardEdit(cardId, newTitle)}
                     onOpen={() => setSelectedCard(card)}
                 />
                ))}
              </div>
              </DroppableList>
            </SortableContext>
            <AddCardForm
              listId={list.id}
              onCardAdded={(newCard) =>
                handleCardAdded({ ...newCard, description: null }, list.id)
              }
            />
          </div>
        ))}
        <AddListForm boardId={id} onListAdded={handleListAdded} />
      </div>
    </DndContext>
{selectedCard && (
  <CardModal
    card={selectedCard}
    onClose={() => setSelectedCard(null)}
    onSave={handleDescriptionSave}
  />
)}
  </div>
 )}