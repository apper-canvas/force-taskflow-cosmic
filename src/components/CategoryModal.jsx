import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

const CategoryModal = ({ isOpen, onClose, onSubmit, category }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#0891b2'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Predefined color options
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

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen, category]);

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
    
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim()
      });
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-heading font-semibold text-surface-900">
                  {category ? 'Edit Category' : 'Create New Category'}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-surface-50 transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter category name..."
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                      errors.name ? 'border-error' : 'border-surface-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-error text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-3">
                    Category Color
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorOptions.map(color => (
                      <motion.button
                        key={color}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleColorSelect(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color 
                            ? 'border-surface-900 shadow-lg' 
                            : 'border-surface-200 hover:border-surface-400'
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {formData.color === color && (
                          <ApperIcon name="Check" size={16} className="text-white mx-auto" />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Color Input */}
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

                  {/* Preview */}
                  <div className="mt-3 p-3 rounded-lg bg-surface-50">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: formData.color }}
                      />
                      <span className="text-sm text-surface-900">
                        {formData.name || 'Category Name'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      category ? 'Update Category' : 'Create Category'
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;