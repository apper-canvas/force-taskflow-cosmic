import { motion } from 'framer-motion';

const Card = ({ children, className = '', initial, animate, exit, transition, whileHover, ...rest }) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      whileHover={whileHover}
      className={`bg-white rounded-lg p-6 shadow-sm border border-surface-200 ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default Card;