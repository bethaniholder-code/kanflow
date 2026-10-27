import { useDroppable } from '@dnd-kit/core'

type Props = {
    id: string
    children: React.ReactNode
}

export default function DroppableList({ id, children }: Props) {
    const { setNodeRef } = useDroppable({ id })

    return <div ref={setNodeRef}>{children}</div>
}
