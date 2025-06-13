import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    &lt;AnimatePresence>
      {isOpen && (
        &lt;>
          &lt;motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          &lt;motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            &lt;div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              &lt;div className="flex items-center justify-between mb-6">
                &lt;h3 className="text-lg font-heading font-semibold text-surface-900">{title}&lt;/h3>
                &lt;Button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-surface-50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  &lt;ApperIcon name="X" size={20} className="text-surface-500" />
                &lt;/Button>
              &lt;/div>
              {children}
            &lt;/div>
          &lt;/motion.div>
        &lt;/>
      )}
    &lt;/AnimatePresence>
  );
};

export default Modal;