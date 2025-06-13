import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message, onRetry }) => {
  return (
    &lt;div className="h-full flex items-center justify-center p-6">
      &lt;motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        &lt;ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        &lt;h3 className="text-lg font-medium text-surface-900 mb-2">Failed to Load&lt;/h3>
        &lt;p className="text-surface-600 mb-4">{message}&lt;/p>
        &lt;Button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Try Again
        &lt;/Button>
      &lt;/motion.div>
    &lt;/div>
  );
};

export default ErrorState;