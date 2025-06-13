import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';

const FormField = ({ label, name, value, onChange, error, type = 'text', options, children, ...rest }) => {
  const inputProps = { name, value, onChange, ...rest };
  const errorClass = error ? 'border-error' : 'border-surface-300';

  let FieldComponent;
  switch (type) {
    case 'textarea':
      FieldComponent = &lt;Textarea className={errorClass} {...inputProps} />;
      break;
    case 'select':
      FieldComponent = (
        &lt;Select className={errorClass} {...inputProps}>
          {options?.map(option => (
            &lt;option key={option.value || option} value={option.value || option}>
              {option.label || option}
            &lt;/option>
          ))}
          {children}
        &lt;/Select>
      );
      break;
    default:
      FieldComponent = &lt;Input type={type} className={errorClass} {...inputProps} />;
  }

  return (
    &lt;div>
      {label && &lt;Label htmlFor={name}>{label}&lt;/Label>}
      {FieldComponent}
      {error && &lt;p className="text-error text-sm mt-1">{error}&lt;/p>}
    &lt;/div>
  );
};

export default FormField;