import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ iconName, title, description, buttonText, onButtonClick }) => {
  return (
    &lt;motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      &lt;motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        &lt;ApperIcon name={iconName} className="w-16 h-16 text-surface-300 mx-auto" />
      &lt;/motion.div>
      &lt;h3 className="mt-4 text-lg font-medium text-surface-900">{title}&lt;/h3>
      &lt;p className="mt-2 text-surface-600">
        {description}
      &lt;/p>
      {onButtonClick && (
        &lt;Button
          onClick={onButtonClick}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          {buttonText}
        &lt;/Button>
      )}
    &lt;/motion.div>
  );
};

export default EmptyState;