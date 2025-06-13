import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import CategoryModal from '../components/CategoryModal';
import { categoryService, taskService } from '../services';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesResult, tasksResult] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ]);
      setCategories(categoriesResult);
      setTasks(tasksResult);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTaskCount = (categoryName) => {
    return tasks.filter(task => task.category === categoryName).length;
  };

  const getCategoryCompletedCount = (categoryName) => {
    return tasks.filter(task => 
      task.category === categoryName && task.status === 'completed'
    ).length;
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const newCategory = await categoryService.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
      setIsModalOpen(false);
      toast.success('Category created successfully');
    } catch (err) {
      toast.error('Failed to create category');
    }
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      const updatedCategory = await categoryService.update(editingCategory.id, categoryData);
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id ? updatedCategory : cat
      ));
      
      // Update tasks with the new category name if it changed
      if (editingCategory.name !== categoryData.name) {
        const categoryTasks = tasks.filter(task => task.category === editingCategory.name);
        for (const task of categoryTasks) {
          await taskService.update(task.id, { category: categoryData.name });
        }
        // Reload tasks to reflect the change
        const updatedTasks = await taskService.getAll();
        setTasks(updatedTasks);
      }
      
      setEditingCategory(null);
      setIsModalOpen(false);
      toast.success('Category updated successfully');
    } catch (err) {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (category) => {
    const taskCount = getCategoryTaskCount(category.name);
    if (taskCount > 0) {
      toast.error(`Cannot delete category with ${taskCount} tasks`);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await categoryService.delete(category.id);
      setCategories(prev => prev.filter(cat => cat.id !== category.id));
      toast.success('Category deleted');
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const getCompletionPercentage = (categoryName) => {
    const total = getCategoryTaskCount(categoryName);
    const completed = getCategoryCompletedCount(categoryName);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="h-full p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
              >
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-surface-200 rounded-full"></div>
                    <div className="h-5 bg-surface-200 rounded w-24"></div>
                  </div>
                  <div className="h-3 bg-surface-200 rounded w-16"></div>
                  <div className="h-2 bg-surface-200 rounded w-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to Load Categories</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-full">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-surface-900">Categories</h2>
              <p className="text-surface-600 mt-1">
                Organize your tasks with custom categories
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <ApperIcon name="Plus" size={20} />
              <span className="hidden sm:inline">New Category</span>
            </motion.button>
          </div>

          {/* Categories Grid */}
          {categories.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="Tag" className="w-16 h-16 text-surface-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-surface-900">No categories yet</h3>
              <p className="mt-2 text-surface-600">
                Create your first category to organize your tasks
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Category
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {categories.map((category, index) => {
                  const taskCount = getCategoryTaskCount(category.name);
                  const completedCount = getCategoryCompletedCount(category.name);
                  const completionPercentage = getCompletionPercentage(category.name);

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 hover:shadow-md transition-all duration-200 max-w-full"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                          />
                          <h3 className="font-medium text-surface-900 truncate">
                            {category.name}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditModal(category)}
                            className="p-1.5 rounded-lg hover:bg-surface-50 transition-colors"
                          >
                            <ApperIcon name="Edit2" size={14} className="text-surface-500" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteCategory(category)}
                            className="p-1.5 rounded-lg hover:bg-error/5 transition-colors"
                            disabled={taskCount > 0}
                          >
                            <ApperIcon 
                              name="Trash2" 
                              size={14} 
                              className={taskCount > 0 ? "text-surface-300" : "text-error"} 
                            />
                          </motion.button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-surface-600">
                            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                          </span>
                          <span className="text-surface-600">
                            {completedCount}/{taskCount} completed
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-surface-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPercentage}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-2 bg-gradient-to-r from-success to-success/80 rounded-full"
                            style={{ 
                              background: taskCount > 0 
                                ? `linear-gradient(90deg, ${category.color}, ${category.color}90)` 
                                : '#e2e8f0'
                            }}
                          />
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-medium text-surface-700">
                            {completionPercentage}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        category={editingCategory}
      />
    </div>
  );
};

export default Categories;