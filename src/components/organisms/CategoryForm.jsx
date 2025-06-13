import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ApperIcon from '@/components/ApperIcon';
import Dot from '@/components/atoms/Dot';

const colorOptions = [
  '#0891b2', // Primary
  '#06b6d4', // Secondary
  '#f59e0b', // Accent
  '#10b981', // Success
  '#ef4444', // Error
  '#3b82f6', // Info
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f97316', // Orange
  '#84cc16', // Lime
  '#06b6d4', // Cyan
  '#6366f1'  // Indigo
];

const CategoryForm = ({ onSubmit, category, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#0891b2'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color
      });
    } else {
      setFormData({
        name: '',
        color: '#0891b2'
      });
    }
    setErrors({});
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleColorSelect = (color) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await onSubmit({
      ...formData,
      name: formData.name.trim()
    });
  };

return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField
        label="Category Name *"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter category name..."
        error={errors.name}
      />

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-3">
          Category Color
        </label>
        <div className="grid grid-cols-6 gap-2">
          {colorOptions.map(color => (
            <Button
              key={color}
              type="button"
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-full border-2 ${
                formData.color === color 
                  ? 'border-surface-900 shadow-lg' 
                  : 'border-surface-200 hover:border-surface-400'
              }`}
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {formData.color === color && (
                <ApperIcon name="Check" size={16} className="text-white mx-auto" />
              )}
            </Button>
          ))}
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-8 h-8 rounded border border-surface-300 cursor-pointer"
            />
            <span className="text-sm text-surface-600">Custom color</span>
          </div>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-surface-50">
          <div className="flex items-center gap-2">
            <Dot color={formData.color} className="w-4 h-4" />
            <span className="text-sm text-surface-900">
              {formData.name || 'Category Name'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={() => {
            setFormData({ name: '', color: '#0891b2' });
            setErrors({});
          }}
          className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner />
              <span>Saving...</span>
            </div>
          ) : (
            category ? 'Update Category' : 'Create Category'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;