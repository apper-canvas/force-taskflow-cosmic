import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    &lt;div className="h-full flex items-center justify-center p-6">
      &lt;motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md"
      >
        &lt;motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          &lt;ApperIcon name="FileQuestion" className="w-24 h-24 text-surface-300 mx-auto mb-6" />
        &lt;/motion.div>
        
        &lt;h1 className="text-4xl font-heading font-bold text-surface-900 mb-2">
          404
        &lt;/h1>
        &lt;h2 className="text-xl font-medium text-surface-700 mb-4">
          Page Not Found
        &lt;/h2>
        &lt;p className="text-surface-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        &lt;/p>
        
        &lt;div className="flex flex-col sm:flex-row gap-3 justify-center">
          &lt;Button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50"
          >
            Go Back
          &lt;/Button>
          
          &lt;Button
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Tasks
          &lt;/Button>
        &lt;/div>
      &lt;/motion.div>
    &lt;/div>
  );
};

export default NotFoundPage;