import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast } from 'date-fns';
import ApperIcon from './ApperIcon';
import { taskService } from '../services';

const MainFeature = () => {
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
      const today = new Date();
      
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-surface-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-surface-200">
            <div className="animate-pulse">
              <div className="h-5 bg-surface-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-surface-200 rounded"></div>
                    <div className="h-4 bg-surface-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full">
      {/* Today's Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <ApperIcon name="Calendar" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-surface-900">
            Today's Tasks
          </h3>
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
            {todayTasks.length}
          </span>
        </div>

        {todayTasks.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="CheckCircle" className="w-12 h-12 text-success mx-auto mb-3" />
            <p className="text-surface-600">All caught up for today! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.slice(0, 5).map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-50 transition-colors max-w-full"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuickComplete(task.id)}
                  className="w-5 h-5 rounded border-2 border-surface-300 hover:border-primary transition-colors flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <p className="text-surface-900 font-medium truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs capitalize ${getPriorityColor(task.priority)}`}>
                      {task.priority} priority
                    </span>
                    <span className="text-xs text-surface-500">
                      {task.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {todayTasks.length > 5 && (
              <p className="text-sm text-surface-500 text-center pt-2">
                +{todayTasks.length - 5} more tasks today
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-error/5 to-warning/5 rounded-lg p-6 border border-error/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <ApperIcon name="AlertTriangle" size={20} className="text-error" />
            <h3 className="text-lg font-heading font-semibold text-surface-900">
              Overdue Tasks
            </h3>
            <span className="bg-error/10 text-error px-2 py-1 rounded-full text-sm">
              {overdueTasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {overdueTasks.slice(0, 3).map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/50 max-w-full"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuickComplete(task.id)}
                  className="w-5 h-5 rounded border-2 border-error hover:border-error/70 transition-colors flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <p className="text-surface-900 font-medium truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-error">
                      Due {format(new Date(task.dueDate), 'MMM d')}
                    </span>
                    <span className="text-xs text-surface-500">
                      {task.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {overdueTasks.length > 3 && (
              <p className="text-sm text-error/70 text-center pt-2">
                +{overdueTasks.length - 3} more overdue tasks
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {todayTasks.length}
          </div>
          <div className="text-sm text-surface-600">Today's Tasks</div>
        </div>
        
        <div className="bg-gradient-to-br from-error/10 to-warning/10 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-error mb-1">
            {overdueTasks.length}
          </div>
          <div className="text-sm text-surface-600">Overdue</div>
        </div>
      </motion.div>
    </div>
  );
};

export default MainFeature;