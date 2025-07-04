import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ iconName, title, description, buttonText, onButtonClick }) => {
return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name={iconName} className="w-16 h-16 text-surface-300 mx-auto" />
      </motion.div>
      <h3 className="mt-4 text-lg font-medium text-surface-900">{title}</h3>
      <p className="mt-2 text-surface-600">
        {description}
      </p>
      {onButtonClick && (
        <Button
          onClick={onButtonClick}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          {buttonText}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;