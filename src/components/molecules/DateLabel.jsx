import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const formatDateLabel = (dateString) => {
  const taskDate = new Date(dateString);
  if (isToday(taskDate)) return 'Today';
  if (isTomorrow(taskDate)) return 'Tomorrow';
  if (isYesterday(taskDate)) return 'Yesterday';
  return format(taskDate, 'MMM d, yyyy');
};

const DateLabel = ({ dateString }) => {
  if (!dateString) return null;
  return (
    &lt;div className="flex items-center gap-1 text-xs text-surface-600">
      &lt;ApperIcon name="Calendar" size={14} />
      &lt;span>{formatDateLabel(dateString)}&lt;/span>
    &lt;/div>
  );
};

export default DateLabel;