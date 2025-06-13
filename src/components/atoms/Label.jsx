const Label = ({ children, className = '', ...rest }) => {
  return (
    <label className={`block text-sm font-medium text-surface-700 mb-2 ${className}`} {...rest}>
      {children}
    </label>
  );
};

export default Label;