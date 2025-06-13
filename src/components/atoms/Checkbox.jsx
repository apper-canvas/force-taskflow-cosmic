const Checkbox = ({ checked, onChange, className = '', ...rest }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`task-checkbox ${className}`}
      {...rest}
    />
  );
};

export default Checkbox;