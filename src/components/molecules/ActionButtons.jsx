import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ActionButtons = ({ onEdit, onDelete, disableDelete = false, editIconSize = 16, deleteIconSize = 16 }) => {
  return (
    &lt;div className="flex items-center gap-1 flex-shrink-0">
      &lt;Button
        onClick={onEdit}
        className="p-2 rounded-lg hover:bg-surface-50"
      >
        &lt;ApperIcon name="Edit2" size={editIconSize} className="text-surface-500" />
      &lt;/Button>
      
      &lt;Button
        onClick={onDelete}
        className="p-2 rounded-lg hover:bg-error/5"
        disabled={disableDelete}
      >
        &lt;ApperIcon 
          name="Trash2" 
          size={deleteIconSize} 
          className={disableDelete ? "text-surface-300" : "text-error"} 
        />
      &lt;/Button>
    &lt;/div>
  );
};

export default ActionButtons;