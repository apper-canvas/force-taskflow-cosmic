const Textarea = ({ className = '', ...rest }) => {
  return (
    <textarea
      rows={3}
      className={`w-full px-3 py-2 border border-surface-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none ${className}`}
      {...rest}
    />
  );
};

export default Textarea;