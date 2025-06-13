import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';
import TaskModal from '../components/TaskModal';
import FilterSidebar from '../components/FilterSidebar';
import { taskService } from '../services';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getAll();
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(task => {
        const dueDate = new Date(task.dueDate);
        const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
        
        switch (filters.dateRange) {
          case 'today':
            return taskDate.getTime() === today.getTime();
          case 'overdue':
            return taskDate < today && task.status === 'pending';
          case 'upcoming':
            return taskDate > today;
          default:
            return true;
        }
      });
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [newTask, ...prev]);
      setIsModalOpen(false);
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(editingTask.id, taskData);
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? updatedTask : task
      ));
      setEditingTask(null);
      setIsModalOpen(false);
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = await taskService.update(task.id, {
        status: task.status === 'completed' ? 'pending' : 'completed',
        completedAt: task.status === 'pending' ? new Date().toISOString() : null
      });
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      toast.success(
        task.status === 'pending' ? 'Task completed!' : 'Task reopened'
      );
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const formatDateLabel = (date) => {
    const taskDate = new Date(date);
    if (isToday(taskDate)) return 'Today';
    if (isTomorrow(taskDate)) return 'Tomorrow';
    if (isYesterday(taskDate)) return 'Yesterday';
    return format(taskDate, 'MMM d, yyyy');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error text-white';
      case 'medium': return 'bg-warning text-white';
      case 'low': return 'bg-success text-white';
      default: return 'bg-surface-200 text-surface-700';
    }
  };

  const getPriorityDotClass = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error priority-high';
      case 'medium': return 'bg-warning priority-medium';
      case 'low': return 'bg-success priority-low';
      default: return 'bg-surface-400';
    }
  };

  if (loading) {
    return (
      <div className="h-full p-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
              >
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-surface-200 rounded-full w-16"></div>
                    <div className="h-6 bg-surface-200 rounded-full w-20"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">
            Failed to Load Tasks
          </h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadTasks}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden max-w-full">
      {/* Filter Sidebar - Desktop */}
      <div className="hidden lg:block">
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          tasks={tasks}
        />
      </div>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50"
            >
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                tasks={tasks}
                onClose={() => setIsFilterOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="p-6 max-w-full">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-surface-900">
                  My Tasks
                </h2>
                <p className="text-surface-600 mt-1">
                  {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
                >
                  <ApperIcon name="Filter" size={20} className="text-surface-600" />
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <ApperIcon name="Plus" size={20} />
                  <span className="hidden sm:inline">New Task</span>
                </motion.button>
              </div>
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <ApperIcon name="CheckSquare" className="w-16 h-16 text-surface-300 mx-auto" />
                </motion.div>
                <h3 className="mt-4 text-lg font-medium text-surface-900">
                  {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
                </h3>
                <p className="mt-2 text-surface-600">
                  {tasks.length === 0 
                    ? 'Create your first task to get started'
                    : 'Try adjusting your filters or create a new task'
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Task
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                      className={`bg-white rounded-lg p-4 shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200 max-w-full ${
                        task.status === 'completed' ? 'opacity-75' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className="flex-shrink-0 mt-1"
                        >
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={() => {}} // Handled by button click
                            className="task-checkbox"
                          />
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className={`font-medium text-surface-900 break-words ${
                                task.status === 'completed' ? 'line-through' : ''
                              }`}>
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-sm text-surface-600 mt-1 break-words">
                                  {task.description}
                                </p>
                              )}
                              
                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                {/* Due Date */}
                                <div className="flex items-center gap-1 text-xs text-surface-600">
                                  <ApperIcon name="Calendar" size={14} />
                                  <span>{formatDateLabel(task.dueDate)}</span>
                                </div>

                                {/* Priority */}
                                <div className="flex items-center gap-1">
                                  <div className={`w-2 h-2 rounded-full ${getPriorityDotClass(task.priority)}`}></div>
                                  <span className="text-xs text-surface-600 capitalize">
                                    {task.priority}
                                  </span>
                                </div>

                                {/* Category */}
                                <span className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-full">
                                  {task.category}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openEditModal(task)}
                                className="p-2 rounded-lg hover:bg-surface-50 transition-colors"
                              >
                                <ApperIcon name="Edit2" size={16} className="text-surface-500" />
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-2 rounded-lg hover:bg-error/5 transition-colors"
                              >
                                <ApperIcon name="Trash2" size={16} className="text-error" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />
    </div>
  );
};

export default Home;