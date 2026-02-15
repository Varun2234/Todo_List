import { format, isPast, isToday } from 'date-fns'

export const formatDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return format(date, 'MMM dd, yyyy')
}

export const isOverdue = (dateString) => {
  if (!dateString) return false
  const date = new Date(dateString)
  return isPast(date) && !isToday(date)
}

export const generateId = () => Math.random().toString(36).substr(2, 9)