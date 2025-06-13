import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FilterSidebar = ({ filters, onFiltersChange, tasks, onClose }) => {
  const updateFilter = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: 'all',
      category: 'all',
      priority: 'all',
      dateRange: 'all'
    });
  };

  // Get unique categories from tasks
  const categories = [...new Set(tasks.map(task => task.category))];

  const statusOptions = [
    { value: 'all', label: 'All Tasks', count: tasks.length },
    { value: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
    { value: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority', color: 'text-error' },
    { value: 'medium', label: 'Medium Priority', color: 'text-warning' },
    { value: 'low', label: 'Low Priority', color: 'text-success' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'upcoming', label: 'Upcoming' }
  ];

  const FilterButton = ({ isActive, onClick, children }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-primary text-white shadow-sm' 
          : 'text-surface-700 hover:bg-surface-50'
      }`}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="w-64 bg-white border-r border-surface-200 h-full overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading font-semibold text-surface-900">Filters</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-surface-50 transition-colors lg:hidden"
            >
              <ApperIcon name="X" size={18} className="text-surface-500" />
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Status Filter */}
          <div>
            <h4 className="text-sm font-medium text-surface-600 mb-3">Status</h4>
            <div className="space-y-1">
              {statusOptions.map(option => (
                <FilterButton
                  key={option.value}
                  isActive={filters.status === option.value}
                  onClick={() => updateFilter('status', option.value)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{option.label}</span>
                    <span className="text-xs opacity-75">{option.count}</span>
                  </div>
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-sm font-medium text-surface-600 mb-3">Category</h4>
            <div className="space-y-1">
              <FilterButton
                isActive={filters.category === 'all'}
                onClick={() => updateFilter('category', 'all')}
              >
                <span className="text-sm">All Categories</span>
              </FilterButton>
              {categories.map(category => (
                <FilterButton
                  key={category}
                  isActive={filters.category === category}
                  onClick={() => updateFilter('category', category)}
                >
                  <span className="text-sm">{category}</span>
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <h4 className="text-sm font-medium text-surface-600 mb-3">Priority</h4>
            <div className="space-y-1">
              {priorityOptions.map(option => (
                <FilterButton
                  key={option.value}
                  isActive={filters.priority === option.value}
                  onClick={() => updateFilter('priority', option.value)}
                >
                  <div className="flex items-center gap-2">
                    {option.value !== 'all' && (
                      <div className={`w-2 h-2 rounded-full ${
                        option.value === 'high' ? 'bg-error' :
                        option.value === 'medium' ? 'bg-warning' : 'bg-success'
                      }`} />
                    )}
                    <span className={`text-sm ${filters.priority === option.value ? 'text-white' : option.color || 'text-surface-700'}`}>
                      {option.label}
                    </span>
                  </div>
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <h4 className="text-sm font-medium text-surface-600 mb-3">Date Range</h4>
            <div className="space-y-1">
              {dateRangeOptions.map(option => (
                <FilterButton
                  key={option.value}
                  isActive={filters.dateRange === option.value}
                  onClick={() => updateFilter('dateRange', option.value)}
                >
                  <span className="text-sm">{option.label}</span>
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <div className="pt-4 border-t border-surface-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTip={{ scale: 0.98 }}
              onClick={clearAllFilters}
              className="w-full px-3 py-2 text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-50 rounded-lg transition-colors"
            >
              Clear All Filters
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;