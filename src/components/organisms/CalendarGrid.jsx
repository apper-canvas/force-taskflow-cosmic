import { motion } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  isSameDay
} from 'date-fns';

const getPriorityCalendarColor = (priority) => {
  switch (priority) {
    case 'high': return 'bg-error/80 text-white';
    case 'medium': return 'bg-warning/80 text-white';
    case 'low': return 'bg-success/80 text-white';
    default: return 'bg-surface-400 text-white';
  }
};

const CalendarGrid = ({ tasks, currentDate, onDateClick, onTaskClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDate = (date) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.dueDate), date)
    );
  };

  return (
    &lt;div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
      &lt;div className="grid grid-cols-7 gap-0 border-b border-surface-200">
        {weekDays.map(day => (
          &lt;div key={day} className="p-3 text-center text-sm font-medium text-surface-700 bg-surface-50">
            {day}
          &lt;/div>
        ))}
      &lt;/div>

      &lt;div className="calendar-grid">
        {calendarDays.map((day, index) => {
          const dayTasks = getTasksForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDay = isToday(day);

          return (
            &lt;motion.div
              key={day.toISOString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`calendar-day cursor-pointer hover:bg-surface-50 transition-colors ${
                !isCurrentMonth ? 'other-month' : ''
              } ${isTodayDay ? 'today' : ''}`}
              onClick={() => onDateClick(day)}
            >
              &lt;div className="flex items-center justify-between mb-2">
                &lt;span className={`text-sm font-medium ${
                  isTodayDay ? 'text-primary' : isCurrentMonth ? 'text-surface-900' : 'text-surface-400'
                }`}>
                  {format(day, 'd')}
                &lt;/span>
                {dayTasks.length > 0 && (
                  &lt;span className="text-xs text-surface-500">
                    {dayTasks.length}
                  &lt;/span>
                )}
              &lt;/div>

              &lt;div className="space-y-1 max-w-full">
                {dayTasks.slice(0, 3).map(task => (
                  &lt;motion.div
                    key={task.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick(task);
                    }}
                    className={`calendar-task ${getPriorityCalendarColor(task.priority)} truncate`}
                    title={task.title}
                  >
                    {task.title}
                  &lt;/motion.div>
                ))}
                {dayTasks.length > 3 && (
                  &lt;div className="text-xs text-surface-500">
                    +{dayTasks.length - 3} more
                  &lt;/div>
                )}
              &lt;/div>
            &lt;/motion.div>
          );
        })}
      &lt;/div>
    &lt;/div>
  );
};

export default CalendarGrid;