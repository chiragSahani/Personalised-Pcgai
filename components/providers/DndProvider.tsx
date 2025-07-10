"use client"

import type React from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

interface DndProviderProps {
  children: React.ReactNode
  items: { id: string }[] // Items must have an 'id' property for dnd-kit
  onDragEnd: (event: any) => void
}

export function DndProvider({ children, items, onDragEnd }: DndProviderProps) {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}
