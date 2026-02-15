import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

const COLUMNS = ['todo', 'doing', 'done']

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      searchQuery: '',
      priorityFilter: 'all',
      sortByDueDate: false,

      // Actions
      addTask: (taskData) => {
        const newTask = {
          id: uuidv4(),
          ...taskData,
          column: 'todo',
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
        return newTask
      },

      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        }))
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }))
      },

      moveTask: (taskId, newColumn) => {
        if (!COLUMNS.includes(newColumn)) return
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, column: newColumn } : task
          ),
        }))
      },

      reorderTasks: (column, oldIndex, newIndex) => {
        const columnTasks = get().getTasksByColumn(column)
        const [movedTask] = columnTasks.splice(oldIndex, 1)
        columnTasks.splice(newIndex, 0, movedTask)
        
        set((state) => ({
          tasks: [
            ...state.tasks.filter((t) => t.column !== column),
            ...columnTasks,
          ],
        }))
      },

      resetBoard: () => {
        if (confirm('Are you sure you want to reset the board? This will delete all tasks.')) {
          set({ tasks: [], searchQuery: '', priorityFilter: 'all', sortByDueDate: false })
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setPriorityFilter: (filter) => set({ priorityFilter: filter }),
      toggleSortByDueDate: () => set((state) => ({ sortByDueDate: !state.sortByDueDate })),

      // Getters
      getTasksByColumn: (column) => {
        const state = get()
        let tasks = state.tasks.filter((task) => task.column === column)

        // Apply search
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase()
          tasks = tasks.filter((task) => 
            task.title.toLowerCase().includes(query)
          )
        }

        // Apply priority filter
        if (state.priorityFilter !== 'all') {
          tasks = tasks.filter((task) => task.priority === state.priorityFilter)
        }

        // Apply sorting
        if (state.sortByDueDate) {
          tasks.sort((a, b) => {
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return new Date(a.dueDate) - new Date(b.dueDate)
          })
        }

        return tasks
      },

      getTaskById: (id) => get().tasks.find((task) => task.id === id),
    }),
    {
      name: 'task-storage',
    }
  )
)