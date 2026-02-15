import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'

const MAX_ACTIVITIES = 50

export const useActivityStore = create(
  persist(
    (set, get) => ({
      activities: [],

      logActivity: (type, details) => {
        const activity = {
          id: Date.now(),
          type,
          details,
          timestamp: new Date().toISOString(),
          formattedTime: format(new Date(), 'MMM dd, HH:mm'),
        }

        set((state) => ({
          activities: [activity, ...state.activities].slice(0, MAX_ACTIVITIES),
        }))
      },

      clearActivities: () => set({ activities: [] }),
    }),
    {
      name: 'activity-storage',
    }
  )
)