import { useTaskStore } from '../../stores/taskStore'
import { Search, Filter, ArrowUpDown } from 'lucide-react'

export default function SearchFilter() {
  const { 
    searchQuery, 
    setSearchQuery, 
    priorityFilter, 
    setPriorityFilter, 
    sortByDueDate, 
    toggleSortByDueDate 
  } = useTaskStore()

  return (
    <div className="glass rounded-xl p-4 flex flex-col md:flex-row gap-4 animate-fade-in">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by title..."
          className="w-full pl-10 pr-4 py-2 bg-dark-900/50 border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
        />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter size={18} className="text-gray-400" />
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 bg-dark-900/50 border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Sort */}
      <button
        onClick={toggleSortByDueDate}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
          sortByDueDate
            ? 'bg-primary-500/20 text-primary-400 border-primary-500/30'
            : 'bg-dark-900/50 text-gray-400 border-white/10 hover:bg-dark-800'
        }`}
      >
        <ArrowUpDown size={18} />
        <span className="hidden sm:inline">Sort by Date</span>
      </button>
    </div>
  )
}