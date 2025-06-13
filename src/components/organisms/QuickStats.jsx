import { motion } from 'framer-motion';

const QuickStats = ({ todayTaskCount, overdueTaskCount }) => {
  return (
    &lt;motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-2 gap-4"
    >
      &lt;div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4 text-center">
        &lt;div className="text-2xl font-bold text-primary mb-1">
          {todayTaskCount}
        &lt;/div>
        &lt;div className="text-sm text-surface-600">Today's Tasks&lt;/div>
      &lt;/div>
      
      &lt;div className="bg-gradient-to-br from-error/10 to-warning/10 rounded-lg p-4 text-center">
        &lt;div className="text-2xl font-bold text-error mb-1">
          {overdueTaskCount}
        &lt;/div>
        &lt;div className="text-sm text-surface-600">Overdue&lt;/div>
      &lt;/div>
    &lt;/motion.div>
  );
};

export default QuickStats;