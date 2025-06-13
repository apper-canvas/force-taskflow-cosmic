import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import { taskService } from '@/services';

const TodaysOverdueTasks = () => {
  const [todayTasks, setTodayTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const tasks = await taskService.getAll();
      
      const todayFiltered = tasks.filter(task => 
        isToday(new Date(task.dueDate)) && task.status === 'pending'
      );
      
      const overdueFiltered = tasks.filter(task => 
        isPast(new Date(task.dueDate)) && 
        !isToday(new Date(task.dueDate)) && 
        task.status === 'pending'
      );
      
      setTodayTasks(todayFiltered);
      setOverdueTasks(overdueFiltered);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickComplete = async (taskId) => {
    try {
      await taskService.update(taskId, {
        status: 'completed',
        completedAt: new Date().toISOString()
      });
      loadTasks(); // Reload to update the lists
      toast.success('Task completed!');
    } catch (err) {
      toast.error('Failed to complete task');
    }
  };

  const getPriorityColorClass = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-surface-600';
    }
  };

  if (loading) {
    return (
      &lt;div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          &lt;div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            &lt;div className="animate-pulse">
              &lt;div className="h-5 bg-surface-200 rounded w-32 mb-4">&lt;/div>
              &lt;div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  &lt;div key={j} className="flex items-center gap-3">
                    &lt;div className="w-5 h-5 bg-surface-200 rounded">&lt;/div>
                    &lt;div className="h-4 bg-surface-200 rounded flex-1">&lt;/div>
                  &lt;/div>
                ))}
              &lt;/div>
            &lt;/div>
          &lt;/div>
        ))}
      &lt;/div>
    );
  }

  return (
    &lt;div className="space-y-6 max-w-full">
      &lt;motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
      >
        &lt;div className="flex items-center gap-2 mb-4">
          &lt;ApperIcon name="Calendar" size={20} className="text-primary" />
          &lt;h3 className="text-lg font-heading font-semibold text-surface-900">
            Today's Tasks
          &lt;/h3>
          &lt;span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
            {todayTasks.length}
          &lt;/span>
        &lt;/div>

        {todayTasks.length === 0 ? (
          &lt;div className="text-center py-8">
            &lt;ApperIcon name="CheckCircle" className="w-12 h-12 text-success mx-auto mb-3" />
            &lt;p className="text-surface-600">All caught up for today! 🎉&lt;/p>
          &lt;/div>
        ) : (
          &lt;div className="space-y-3">
            {todayTasks.slice(0, 5).map((task, index) => (
              &lt;motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-50 transition-colors max-w-full"
              >
                &lt;Button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuickComplete(task.id)}
                  className="w-5 h-5 rounded border-2 border-surface-300 hover:border-primary flex-shrink-0"
                />
                
                &lt;div className="flex-1 min-w-0">
                  &lt;p className="text-surface-900 font-medium truncate">{task.title}&lt;/p>
                  &lt;div className="flex items-center gap-2 mt-1">
                    &lt;span className={`text-xs capitalize ${getPriorityColorClass(task.priority)}`}>
                      {task.priority} priority
                    &lt;/span>
                    &lt;span className="text-xs text-surface-500">
                      {task.category}
                    &lt;/span>
                  &lt;/div>
                &lt;/div>
              &lt;/motion.div>
            ))}
            
            {todayTasks.length > 5 && (
              &lt;p className="text-sm text-surface-500 text-center pt-2">
                +{todayTasks.length - 5} more tasks today
              &lt;/p>
            )}
          &lt;/div>
        )}
      &lt;/motion.div>

      {overdueTasks.length > 0 && (
        &lt;motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-error/5 to-warning/5 rounded-lg p-6 border border-error/20"
        >
          &lt;div className="flex items-center gap-2 mb-4">
            &lt;ApperIcon name="AlertTriangle" size={20} className="text-error" />
            &lt;h3 className="text-lg font-heading font-semibold text-surface-900">
              Overdue Tasks
            &lt;/h3>
            &lt;span className="bg-error/10 text-error px-2 py-1 rounded-full text-sm">
              {overdueTasks.length}
            &lt;/span>
          &lt;/div>

          &lt;div className="space-y-3">
            {overdueTasks.slice(0, 3).map((task, index) => (
              &lt;motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/50 max-w-full"
              >
                &lt;Button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuickComplete(task.id)}
                  className="w-5 h-5 rounded border-2 border-error hover:border-error/70 flex-shrink-0"
                />
                
                &lt;div className="flex-1 min-w-0">
                  &lt;p className="text-surface-900 font-medium truncate">{task.title}&lt;/p>
                  &lt;div className="flex items-center gap-2 mt-1">
                    &lt;span className="text-xs text-error">
                      Due {format(new Date(task.dueDate), 'MMM d')}
                    &lt;/span>
                    &lt;span className="text-xs text-surface-500">
                      {task.category}
                    &lt;/span>
                  &lt;/div>
                &lt;/div>
              &lt;/motion.div>
            ))}
            
            {overdueTasks.length > 3 && (
              &lt;p className="text-sm text-error/70 text-center pt-2">
                +{overdueTasks.length - 3} more overdue tasks
              &lt;/p>
            )}
          &lt;/div>
        &lt;/motion.div>
      )}
    &lt;/div>
  );
};

export default TodaysOverdueTasks;