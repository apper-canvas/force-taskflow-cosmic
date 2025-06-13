import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import TaskModal from '@/components/organisms/TaskModal';
import FilterSidebar from '@/components/organisms/FilterSidebar';
import SectionHeader from '@/components/molecules/SectionHeader';
import Button from '@/components/atoms/Button';
import TaskItem from '@/components/organisms/TaskItem';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import { taskService } from '@/services';

const HomePage = () => {
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

    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

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

  if (loading) {
    return (
      &lt;div className="h-full p-6">
        &lt;div className="max-w-6xl mx-auto">
          &lt;div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              &lt;motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
              >
                &lt;div className="animate-pulse space-y-3">
                  &lt;div className="h-4 bg-surface-200 rounded w-3/4">&lt;/div>
                  &lt;div className="h-3 bg-surface-200 rounded w-1/2">&lt;/div>
                  &lt;div className="flex gap-2">
                    &lt;div className="h-6 bg-surface-200 rounded-full w-16">&lt;/div>
                    &lt;div className="h-6 bg-surface-200 rounded-full w-20">&lt;/div>
                  &lt;/div>
                &lt;/div>
              &lt;/motion.div>
            ))}
          &lt;/div>
        &lt;/div>
      &lt;/div>
    );
  }

  if (error) {
    return &lt;ErrorState message={error} onRetry={loadTasks} title="Failed to Load Tasks" />;
  }

  return (
    &lt;div className="h-full flex overflow-hidden max-w-full">
      &lt;div className="hidden lg:block">
        &lt;FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          tasks={tasks}
        />
      &lt;/div>

      &lt;AnimatePresence>
        {isFilterOpen && (
          &lt;>
            &lt;motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsFilterOpen(false)}
            />
            &lt;motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50"
            >
              &lt;FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                tasks={tasks}
                onClose={() => setIsFilterOpen(false)}
              />
            &lt;/motion.div>
          &lt;/>
        )}
      &lt;/AnimatePresence>

      &lt;div className="flex-1 overflow-y-auto min-w-0">
        &lt;div className="p-6 max-w-full">
          &lt;div className="max-w-4xl mx-auto">
            &lt;SectionHeader
              title="My Tasks"
              subtitle={`${filteredTasks.length} ${filteredTasks.length === 1 ? 'task' : 'tasks'}`}
            >
              &lt;div className="flex items-center gap-3">
                &lt;Button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden p-2 rounded-lg border border-surface-200 hover:bg-surface-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  &lt;ApperIcon name="Filter" size={20} className="text-surface-600" />
                &lt;/Button>
                
                &lt;Button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-sm"
                >
                  &lt;ApperIcon name="Plus" size={20} />
                  &lt;span className="hidden sm:inline">New Task&lt;/span>
                &lt;/Button>
              &lt;/div>
            &lt;/SectionHeader>

            {filteredTasks.length === 0 ? (
              &lt;EmptyState
                iconName="CheckSquare"
                title={tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
                description={
                  tasks.length === 0 
                    ? 'Create your first task to get started'
                    : 'Try adjusting your filters or create a new task'
                }
                buttonText="Create Task"
                onButtonClick={() => setIsModalOpen(true)}
              />
            ) : (
              &lt;div className="space-y-3">
                &lt;AnimatePresence>
                  {filteredTasks.map((task, index) => (
                    &lt;TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onEdit={openEditModal}
                      onDelete={handleDeleteTask}
                      index={index}
                    />
                  ))}
                &lt;/AnimatePresence>
              &lt;/div>
            )}
          &lt;/div>
        &lt;/div>
      &lt;/div>

      &lt;TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />
    &lt;/div>
  );
};

export default HomePage;