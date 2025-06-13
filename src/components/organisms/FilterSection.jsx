import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Dot from '@/components/atoms/Dot';

const FilterButton = ({ isActive, onClick, children }) => (
  &lt;Button
    onClick={onClick}
    className={`w-full text-left px-3 py-2 rounded-lg ${
      isActive 
        ? 'bg-primary text-white shadow-sm' 
        : 'text-surface-700 hover:bg-surface-50'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  &lt;/Button>
);

const FilterSection = ({ title, options, currentFilter, onFilterChange }) => {
  return (
    &lt;div>
      &lt;h4 className="text-sm font-medium text-surface-600 mb-3">{title}&lt;/h4>
      &lt;div className="space-y-1">
        {options.map(option => (
          &lt;FilterButton
            key={option.value}
            isActive={currentFilter === option.value}
            onClick={() => onFilterChange(option.value)}
          >
            &lt;div className="flex items-center justify-between">
              &lt;div className="flex items-center gap-2">
                {option.dotColor && (
                  &lt;Dot 
                    color={currentFilter === option.value ? 'white' : option.dotColor} 
                    className="w-2 h-2" 
                  />
                )}
                &lt;span className="text-sm">{option.label}&lt;/span>
              &lt;/div>
              {option.count !== undefined && &lt;span className="text-xs opacity-75">{option.count}&lt;/span>}
            &lt;/div>
          &lt;/FilterButton>
        ))}
      &lt;/div>
    &lt;/div>
  );
};

export default FilterSection;