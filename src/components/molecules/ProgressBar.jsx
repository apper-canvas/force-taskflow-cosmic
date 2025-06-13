import { motion } from 'framer-motion';

const ProgressBar = ({ percentage, color, delay }) => {
  return (
    &lt;div className="w-full bg-surface-200 rounded-full h-2">
      &lt;motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, delay: delay }}
        className="h-2 rounded-full"
        style={{ 
          background: percentage > 0 
            ? `linear-gradient(90deg, ${color}, ${color}90)` 
            : '#e2e8f0'
        }}
      />
    &lt;/div>
  );
};

export default ProgressBar;