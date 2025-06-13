import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import { categoryService } from '@/services';

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'text-success' },
  { value: 'medium', label: 'Medium', color: 'text-warning' },
  { value: 'high', label: 'High', color: 'text-error' }
];

const TaskForm = ({ onSubmit, task, defaultDate, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: 'Personal',
    priority: 'medium'
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd'),
        category: task.category,
        priority: task.priority
      });
    } else if (defaultDate) {
      setFormData(prev => ({
        ...prev,
        dueDate: format(defaultDate, 'yyyy-MM-dd')
      }));
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        category: 'Personal',
        priority: 'medium'
      });
    }
    setErrors({});
  }, [task, defaultDate]);

  const loadCategories = async () => {
    try {
      const result = await categoryService.getAll();
      setCategories(result);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const submitData = {
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString()
    };
    onSubmit(submitData);
  };

  return (
    &lt;form onSubmit={handleSubmit} className="space-y-4">
      &lt;FormField
        label="Task Title *"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Enter task title..."
        error={errors.title}
      />

      &lt;FormField
        label="Description"
        type="textarea"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Add task description..."
      />

      &lt;FormField
        label="Due Date *"
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleInputChange}
        error={errors.dueDate}
      />

      &lt;FormField
        label="Category"
        type="select"
        name="category"
        value={formData.category}
        onChange={handleInputChange}
      >
        {categories.map(category => (
          &lt;option key={category.id} value={category.name}>
            {category.name}
          &lt;/option>
        ))}
      &lt;/FormField>

      &lt;div>
        &lt;label className="block text-sm font-medium text-surface-700 mb-2">
          Priority
        &lt;/label>
        &lt;div className="grid grid-cols-3 gap-2">
          {priorityOptions.map(option => (
            &lt;Button
              key={option.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, priority: option.value }))}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                formData.priority === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-surface-200 hover:border-surface-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              &lt;div className="text-center">
                &lt;div className={`text-sm font-medium ${
                  formData.priority === option.value ? 'text-primary' : option.color
                }`}>
                  {option.label}
                &lt;/div>
              &lt;/div>
            &lt;/Button>
          ))}
        &lt;/div>
      &lt;/div>

      &lt;div className="flex gap-3 pt-4">
        &lt;Button
          type="button"
          onClick={() => {
            setFormData({
              title: '',
              description: '',
              dueDate: format(new Date(), 'yyyy-MM-dd'),
              category: 'Personal',
              priority: 'medium'
            });
            setErrors({});
          }}
          className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        &lt;/Button>
        
        &lt;Button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            &lt;div className="flex items-center justify-center gap-2">
              &lt;LoadingSpinner />
              &lt;span>Saving...&lt;/span>
            &lt;/div>
          ) : (
            task ? 'Update Task' : 'Create Task'
          )}
        &lt;/Button>
      &lt;/div>
    &lt;/form>
  );
};

export default TaskForm;