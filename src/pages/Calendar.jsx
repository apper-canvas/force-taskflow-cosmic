import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  addMonths,
  subMonths,
  isSameDay
} from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import TaskModal from '../components/TaskModal';
import { taskService } from '../services';

const Calendar = () => {
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

  const getTasksForDate = (date) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.dueDate), date)
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error/80 text-white';
      case 'medium': return 'bg-warning/80 text-white';
      case 'low': return 'bg-success/80 text-white';
      default: return 'bg-surface-400 text-white';
    }
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="h-full p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-48 mb-6"></div>
            <div className="calendar-grid">
              {[...Array(42)].map((_, i) => (
                <div key={i} className="calendar-day">
                  <div className="h-4 bg-surface-200 rounded w-8 mb-2"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-surface-200 rounded"></div>
                    <div className="h-3 bg-surface-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to Load Calendar</h3>
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
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-full">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-heading font-bold text-surface-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-lg hover:bg-surface-50 transition-colors"
                >
                  <ApperIcon name="ChevronLeft" size={20} className="text-surface-600" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  Today
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-lg hover:bg-surface-50 transition-colors"
                >
                  <ApperIcon name="ChevronRight" size={20} className="text-surface-600" />
                </motion.button>
              </div>
            </div>

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

          {/* Calendar */}
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
            {/* Week Header */}
            <div className="grid grid-cols-7 gap-0 border-b border-surface-200">
              {weekDays.map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-surface-700 bg-surface-50">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
              {calendarDays.map((day, index) => {
                const dayTasks = getTasksForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isTodayDay = isToday(day);

                return (
                  <motion.div
                    key={day.toISOString()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className={`calendar-day cursor-pointer hover:bg-surface-50 transition-colors ${
                      !isCurrentMonth ? 'other-month' : ''
                    } ${isTodayDay ? 'today' : ''}`}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        isTodayDay ? 'text-primary' : isCurrentMonth ? 'text-surface-900' : 'text-surface-400'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      {dayTasks.length > 0 && (
                        <span className="text-xs text-surface-500">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 max-w-full">
                      {dayTasks.slice(0, 3).map(task => (
                        <motion.div
                          key={task.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskClick(task);
                          }}
                          className={`calendar-task ${getPriorityColor(task.priority)} truncate`}
                          title={task.title}
                        >
                          {task.title}
                        </motion.div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-surface-500">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-surface-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-error/80 rounded"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-warning/80 rounded"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success/80 rounded"></div>
              <span>Low Priority</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
        defaultDate={selectedDate}
      />
    </div>
  );
};

export default Calendar;