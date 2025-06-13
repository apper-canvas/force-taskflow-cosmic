const Input = ({ className = '', ...rest }) => {
  return (
    <input
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${className}`}
      {...rest}
    />
  );
};

export default Input;