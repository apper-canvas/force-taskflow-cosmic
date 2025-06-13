const LoadingSpinner = ({ className = 'w-4 h-4', borderClass = 'border-2 border-white/30 border-t-white', ...rest }) => {
  return (
    <div
      className={`${className} ${borderClass} rounded-full animate-spin`}
      {...rest}
    ></div>
  );
};

export default LoadingSpinner;