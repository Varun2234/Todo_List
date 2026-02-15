import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'
import { Plus } from 'lucide-react'

export default function TaskColumn({ column, tasks, onEditTask, onDeleteTask }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`flex items-center justify-between p-4 rounded-t-xl bg-gradient-to-r ${column.color}`}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">{column.title}</h3>
          <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white font-medium">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 bg-dark-800/50 rounded-b-xl border border-white/5 min-h-[400px] transition-all duration-200 ${
          isOver ? 'drag-over' : ''
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
            
            {tasks.length === 0 && (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-white/5 rounded-lg">
                <p className="text-sm">No tasks yet</p>
                <p className="text-xs mt-1">Drag tasks here or create new</p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}