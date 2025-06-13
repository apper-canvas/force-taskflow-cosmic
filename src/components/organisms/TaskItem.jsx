import { motion } from 'framer-motion';
import Checkbox from '@/components/atoms/Checkbox';
import DateLabel from '@/components/molecules/DateLabel';
import PriorityTag from '@/components/molecules/PriorityTag';
import CategoryTag from '@/components/molecules/CategoryTag';
import ActionButtons from '@/components/molecules/ActionButtons';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete, index }) => {
  return (
    &lt;motion.div
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
      &lt;div className="flex items-start gap-4 min-w-0">
        &lt;button
          onClick={() => onToggleComplete(task)}
          className="flex-shrink-0 mt-1"
        >
          &lt;Checkbox
            checked={task.status === 'completed'}
            onChange={() => {}} 
          />
        &lt;/button>

        &lt;div className="flex-1 min-w-0">
          &lt;div className="flex items-start justify-between gap-4">
            &lt;div className="min-w-0 flex-1">
              &lt;h3 className={`font-medium text-surface-900 break-words ${
                task.status === 'completed' ? 'line-through' : ''
              }`}>
                {task.title}
              &lt;/h3>
              {task.description && (
                &lt;p className="text-sm text-surface-600 mt-1 break-words">
                  {task.description}
                &lt;/p>
              )}
              
              &lt;div className="flex flex-wrap items-center gap-2 mt-3">
                &lt;DateLabel dateString={task.dueDate} />
                &lt;PriorityTag priority={task.priority} />
                &lt;CategoryTag categoryName={task.category} />
              &lt;/div>
            &lt;/div>

            &lt;ActionButtons
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
            />
          &lt;/div>
        &lt;/div>
      &lt;/div>
    &lt;/motion.div>
  );
};

export default TaskItem;