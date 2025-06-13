import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FilterSection from '@/components/organisms/FilterSection';

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

  const categories = [...new Set(tasks.map(task => task.category))].sort();

  const statusOptions = [
    { value: 'all', label: 'All Tasks', count: tasks.length },
    { value: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
    { value: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority', dotColor: '#ef4444' }, // Error
    { value: 'medium', label: 'Medium Priority', dotColor: '#f59e0b' }, // Warning
    { value: 'low', label: 'Low Priority', dotColor: '#10b981' } // Success
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'upcoming', label: 'Upcoming' }
  ];

  return (
    &lt;div className="w-64 bg-white border-r border-surface-200 h-full overflow-y-auto flex-shrink-0">
      &lt;div className="p-4">
        &lt;div className="flex items-center justify-between mb-6">
          &lt;h3 className="font-heading font-semibold text-surface-900">Filters&lt;/h3>
          {onClose && (
            &lt;Button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-surface-50 lg:hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              &lt;ApperIcon name="X" size={18} className="text-surface-500" />
            &lt;/Button>
          )}
        &lt;/div>

        &lt;div className="space-y-6">
          &lt;FilterSection
            title="Status"
            options={statusOptions}
            currentFilter={filters.status}
            onFilterChange={(value) => updateFilter('status', value)}
          />

          &lt;FilterSection
            title="Category"
            options={categoryOptions}
            currentFilter={filters.category}
            onFilterChange={(value) => updateFilter('category', value)}
          />

          &lt;FilterSection
            title="Priority"
            options={priorityOptions}
            currentFilter={filters.priority}
            onFilterChange={(value) => updateFilter('priority', value)}
          />

          &lt;FilterSection
            title="Date Range"
            options={dateRangeOptions}
            currentFilter={filters.dateRange}
            onFilterChange={(value) => updateFilter('dateRange', value)}
          />

          &lt;div className="pt-4 border-t border-surface-200">
            &lt;Button
              onClick={clearAllFilters}
              className="w-full px-3 py-2 text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-50 rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear All Filters
            &lt;/Button>
          &lt;/div>
        &lt;/div>
      &lt;/div>
    &lt;/div>
  );
};

export default FilterSidebar;