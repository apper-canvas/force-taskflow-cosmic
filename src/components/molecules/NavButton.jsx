import { NavLink } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const NavButton = ({ route, type = 'desktop', onClick }) => {
  const baseClass = 'transition-all duration-200';
  const activeClass = 'text-primary bg-primary/5';
  const inactiveClass = 'text-surface-600 hover:text-primary hover:bg-surface-50';

  if (type === 'mobile') {
    return (
      &lt;NavLink
        to={route.path}
        onClick={onClick}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-2 px-3 rounded-lg ${baseClass} ${
            isActive ? activeClass : inactiveClass
          }`
        }
      >
        &lt;ApperIcon name={route.icon} size={20} />
        &lt;span className="text-xs font-medium">{route.label}&lt;/span>
      &lt;/NavLink>
    );
  }

  return (
    &lt;NavLink
      to={route.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg ${baseClass} ${
          isActive ? `${activeClass} font-medium` : 'text-surface-700 hover:text-primary hover:bg-surface-50'
        }`
      }
    >
      &lt;ApperIcon name={route.icon} size={20} />
      {route.label}
    &lt;/NavLink>
  );
};

export default NavButton;