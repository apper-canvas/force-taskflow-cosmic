import Dot from '@/components/atoms/Dot';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'bg-error';
    case 'medium': return 'bg-warning';
    case 'low': return 'bg-success';
    default: return 'bg-surface-400';
  }
};

const PriorityTag = ({ priority }) => {
  if (!priority) return null;

  return (
    &lt;div className="flex items-center gap-1">
      &lt;Dot color={getPriorityColor(priority)} />
      &lt;span className="text-xs text-surface-600 capitalize">
        {priority}
      &lt;/span>
    &lt;/div>
  );
};

export default PriorityTag;