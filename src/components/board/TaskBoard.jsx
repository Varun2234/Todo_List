import { useState } from 'react'
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useTaskStore } from '../../stores/taskStore'
import { useActivityStore } from '../../stores/activityStore'
import { useAuthStore } from '../../stores/authStore'
import TaskColumn from './TaskColumn'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import SearchFilter from './SearchFilter'
import ActivityLog from './ActivityLog'
import { Plus, LogOut, RotateCcw, Activity } from 'lucide-react'

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'from-slate-600 to-slate-500' },
  { id: 'doing', title: 'In Progress', color: 'from-primary-600 to-primary-500' },
  { id: 'done', title: 'Done', color: 'from-emerald-600 to-emerald-500' },
]

export default function TaskBoard() {
  const { logout, user } = useAuthStore()
  const { tasks, moveTask, resetBoard, addTask, updateTask, deleteTask } = useTaskStore()
  const { logActivity } = useActivityStore()
  const [activeId, setActiveId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [showActivity, setShowActivity] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragOver = (event) => {
    const { active, over } = event
    if (!over) return

    const activeTask = tasks.find(t => t.id === active.id)
    const overColumn = COLUMNS.find(c => c.id === over.id)
    
    if (activeTask && overColumn && activeTask.column !== overColumn.id) {
      moveTask(active.id, overColumn.id)
      logActivity('moved', { taskTitle: activeTask.title, from: activeTask.column, to: overColumn.id })
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeTask = tasks.find(t => t.id === active.id)
    const overColumn = COLUMNS.find(c => c.id === over.id)
    
    if (activeTask && overColumn && activeTask.column !== overColumn.id) {
      moveTask(active.id, overColumn.id)
      logActivity('moved', { taskTitle: activeTask.title, from: activeTask.column, to: overColumn.id })
    }
  }

  const handleAddTask = (taskData) => {
    const task = addTask(taskData)
    logActivity('created', { taskTitle: task.title })
    setIsModalOpen(false)
  }

  const handleEditTask = (taskData) => {
    updateTask(editingTask.id, taskData)
    logActivity('edited', { taskTitle: taskData.title })
    setEditingTask(null)
  }

  const handleDeleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task && confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId)
      logActivity('deleted', { taskTitle: task.title })
    }
  }

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <header className="glass rounded-2xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">TaskFlow Board</h1>
            <p className="text-sm text-gray-400">Welcome back, {user?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowActivity(!showActivity)}
            className={`btn-secondary flex items-center gap-2 ${showActivity ? 'bg-primary-500/20 text-primary-400 border-primary-500/30' : ''}`}
          >
            <Activity size={18} />
            <span className="hidden sm:inline">Activity</span>
          </button>
          
          <button
            onClick={resetBoard}
            className="btn-secondary flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <RotateCcw size={18} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            New Task
          </button>
          
          <button
            onClick={logout}
            className="btn-secondary flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Board */}
        <div className="flex-1">
          <SearchFilter />
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {COLUMNS.map((column) => (
                <TaskColumn
                  key={column.id}
                  column={column}
                  tasks={useTaskStore.getState().getTasksByColumn(column.id)}
                  onEditTask={(task) => setEditingTask(task)}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <TaskCard task={activeTask} isDragging />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Activity Sidebar */}
        {showActivity && (
          <div className="lg:w-80 animate-fade-in">
            <ActivityLog />
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen || !!editingTask}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        initialData={editingTask}
      />
    </div>
  )
}