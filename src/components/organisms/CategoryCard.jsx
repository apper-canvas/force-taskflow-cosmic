import { motion } from 'framer-motion';
import ActionButtons from '@/components/molecules/ActionButtons';
import ProgressBar from '@/components/molecules/ProgressBar';
import Dot from '@/components/atoms/Dot';

const CategoryCard = ({ category, taskCount, completedCount, completionPercentage, onEdit, onDelete, index }) => {
  return (
    &lt;motion.div
      key={category.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200 max-w-full"
    >
      &lt;div className="flex items-start justify-between mb-4">
        &lt;div className="flex items-center gap-3 min-w-0 flex-1">
          &lt;Dot color={category.color} className="w-4 h-4 flex-shrink-0" />
          &lt;h3 className="font-medium text-surface-900 truncate">
            {category.name}
          &lt;/h3>
        &lt;/div>
        
        &lt;ActionButtons
          onEdit={() => onEdit(category)}
          onDelete={() => onDelete(category)}
          disableDelete={taskCount > 0}
          editIconSize={14}
          deleteIconSize={14}
        />
      &lt;/div>

      &lt;div className="space-y-3">
        &lt;div className="flex items-center justify-between text-sm">
          &lt;span className="text-surface-600">
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
          &lt;/span>
          &lt;span className="text-surface-600">
            {completedCount}/{taskCount} completed
          &lt;/span>
        &lt;/div>

        &lt;ProgressBar percentage={completionPercentage} color={category.color} delay={index * 0.1} />

        &lt;div className="text-right">
          &lt;span className="text-sm font-medium text-surface-700">
            {completionPercentage}%
          &lt;/span>
        &lt;/div>
      &lt;/div>
    &lt;/motion.div>
  );
};

export default CategoryCard;