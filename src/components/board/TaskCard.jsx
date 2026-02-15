import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, Tag, AlertCircle, GripVertical, Edit2, Trash2 } from 'lucide-react'
import { format, isPast, isToday } from 'date-fns'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const PRIORITY_CONFIG = {
  low: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Low' },
  medium: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Medium' },
  high: { color: 'bg-rose-500/20 text-rose-400 border-rose-500/30', label: 'High' },
}

export default function TaskCard({ task, onEdit, onDelete, isDragging: isOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.column !== 'done'

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-dark-700 rounded-lg p-4 border-2 border-primary-500/50 h-32"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group glass rounded-lg p-4 cursor-grab active:cursor-grabbing hover:shadow-xl transition-all duration-200",
        isOverlay && "shadow-2xl scale-105 rotate-2 cursor-grabbing",
        isOverdue && "border-l-4 border-l-rose-500"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-medium text-gray-100 line-clamp-2 flex-1">{task.title}</h4>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-primary-400 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">{task.description}</p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className={cn("px-2 py-1 rounded-md text-xs font-medium border", priority.color)}>
          {priority.label}
        </span>

        {dueDate && (
          <div className={cn(
            "flex items-center gap-1 text-xs",
            isOverdue ? "text-rose-400" : "text-gray-400"
          )}>
            <Calendar size={12} />
            <span>{format(dueDate, 'MMM dd')}</span>
            {isOverdue && <AlertCircle size={12} />}
          </div>
        )}
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-white/5">
          {task.tags.map((tag, idx) => (
            <span key={idx} className="flex items-center gap-1 px-2 py-0.5 bg-dark-900/50 rounded text-xs text-gray-400">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}