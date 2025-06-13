const Dot = ({ color, className = 'w-2 h-2', ...rest }) => {
  return (
    <div
      className={`${className} rounded-full`}
      style={{ backgroundColor: color }}
      {...rest}
    ></div>
  );
};

export default Dot;