import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, addMonths, subMonths } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import TaskModal from '@/components/organisms/TaskModal';
import Button from '@/components/atoms/Button';
import CalendarGrid from '@/components/organisms/CalendarGrid';
import ErrorState from '@/components/organisms/ErrorState';
import { taskService } from '@/services';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

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

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create({
        ...taskData,
        dueDate: selectedDate ? selectedDate.toISOString() : taskData.dueDate
      });
      setTasks(prev => [...prev, newTask]);
      setIsModalOpen(false);
      setSelectedDate(null);
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(selectedTask.id, taskData);
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id ? updatedTask : task
      ));
      setSelectedTask(null);
      setIsModalOpen(false);
      toast.success('Task updated successfully');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setSelectedDate(null);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  if (loading) {
    return (
      &lt;div className="h-full p-6">
        &lt;div className="max-w-6xl mx-auto">
          &lt;div className="animate-pulse">
            &lt;div className="h-8 bg-surface-200 rounded w-48 mb-6">&lt;/div>
            &lt;div className="calendar-grid">
              {[...Array(42)].map((_, i) => (
                &lt;div key={i} className="calendar-day">
                  &lt;div className="h-4 bg-surface-200 rounded w-8 mb-2">&lt;/div>
                  &lt;div className="space-y-1">
                    &lt;div className="h-3 bg-surface-200 rounded">&lt;/div>
                    &lt;div className="h-3 bg-surface-200 rounded w-3/4">&lt;/div>
                  &lt;/div>
                &lt;/div>
              ))}
            &lt;/div>
          &lt;/div>
        &lt;/div>
      &lt;/div>
    );
  }

  if (error) {
    return &lt;ErrorState message={error} onRetry={loadTasks} title="Failed to Load Calendar" />;
  }

  return (
    &lt;div className="h-full overflow-y-auto">
      &lt;div className="p-6 max-w-full">
        &lt;div className="max-w-6xl mx-auto">
          &lt;div className="flex items-center justify-between mb-6">
            &lt;div className="flex items-center gap-4">
              &lt;h2 className="text-2xl font-heading font-bold text-surface-900">
                {format(currentDate, 'MMMM yyyy')}
              &lt;/h2>
              
              &lt;div className="flex items-center gap-1">
                &lt;Button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-lg hover:bg-surface-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  &lt;ApperIcon name="ChevronLeft" size={20} className="text-surface-600" />
                &lt;/Button>
                
                &lt;Button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm text-primary hover:bg-primary/5 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Today
                &lt;/Button>
                
                &lt;Button
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-lg hover:bg-surface-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  &lt;ApperIcon name="ChevronRight" size={20} className="text-surface-600" />
                &lt;/Button>
              &lt;/div>
            &lt;/div>

            &lt;Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-sm"
            >
              &lt;ApperIcon name="Plus" size={20} />
              &lt;span className="hidden sm:inline">New Task&lt;/span>
            &lt;/Button>
          &lt;/div>

          &lt;CalendarGrid
            tasks={tasks}
            currentDate={currentDate}
            onDateClick={handleDateClick}
            onTaskClick={handleTaskClick}
          />

          &lt;div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-surface-600">
            &lt;div className="flex items-center gap-2">
              &lt;div className="w-3 h-3 bg-error/80 rounded">&lt;/div>
              &lt;span>High Priority&lt;/span>
            &lt;/div>
            &lt;div className="flex items-center gap-2">
              &lt;div className="w-3 h-3 bg-warning/80 rounded">&lt;/div>
              &lt;span>Medium Priority&lt;/span>
            &lt;/div>
            &lt;div className="flex items-center gap-2">
              &lt;div className="w-3 h-3 bg-success/80 rounded">&lt;/div>
              &lt;span>Low Priority&lt;/span>
            &lt;/div>
          &lt;/div>
        &lt;/div>
      &lt;/div>

      &lt;TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
        defaultDate={selectedDate}
      />
    &lt;/div>
  );
};

export default CalendarPage;