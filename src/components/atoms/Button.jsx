import { motion } from 'framer-motion';

const Button = ({ children, className = '', whileHover = { scale: 1.05 }, whileTap = { scale: 0.95 }, ...rest }) => {
  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      className={`transition-all duration-200 ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
};

export default Button;