import { useActivityStore } from '../../stores/activityStore'
import { Activity, Trash2, Plus, Edit3, Move } from 'lucide-react'

const ACTIVITY_ICONS = {
  created: { icon: Plus, color: 'text-emerald-400 bg-emerald-500/20' },
  edited: { icon: Edit3, color: 'text-amber-400 bg-amber-500/20' },
  moved: { icon: Move, color: 'text-primary-400 bg-primary-500/20' },
  deleted: { icon: Trash2, color: 'text-rose-400 bg-rose-500/20' },
}

const ACTIVITY_TEXT = {
  created: (d) => `Created "${d.taskTitle}"`,
  edited: (d) => `Edited "${d.taskTitle}"`,
  moved: (d) => `Moved "${d.taskTitle}" to ${d.to}`,
  deleted: (d) => `Deleted "${d.taskTitle}"`,
}

export default function ActivityLog() {
  const { activities, clearActivities } = useActivityStore()

  return (
    <div className="glass rounded-2xl p-4 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-primary-400" />
          <h3 className="font-semibold text-white">Activity Log</h3>
        </div>
        {activities.length > 0 && (
          <button
            onClick={clearActivities}
            className="text-xs text-gray-500 hover:text-rose-400 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          activities.map((activity) => {
            const config = ACTIVITY_ICONS[activity.type]
            const Icon = config.icon
            
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-dark-900/30 border border-white/5 hover:bg-dark-900/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${config.color}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300">
                    {ACTIVITY_TEXT[activity.type](activity.details)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.formattedTime}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}