import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import CategoryModal from '@/components/organisms/CategoryModal';
import SectionHeader from '@/components/molecules/SectionHeader';
import Button from '@/components/atoms/Button';
import CategoryCard from '@/components/organisms/CategoryCard';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import { categoryService, taskService } from '@/services';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]); // All tasks to count for categories
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
      
      if (editingCategory.name !== categoryData.name) {
        const categoryTasks = tasks.filter(task => task.category === editingCategory.name);
        for (const task of categoryTasks) {
          await taskService.update(task.id, { category: categoryData.name });
        }
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
    return <ErrorState message={error} onRetry={loadData} title="Failed to Load Categories" />;
  }

return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-full">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Categories"
            subtitle="Organize your tasks with custom categories"
          >
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-sm"
            >
              <ApperIcon name="Plus" size={20} />
              <span className="hidden sm:inline">New Category</span>
            </Button>
          </SectionHeader>

          {categories.length === 0 ? (
            <EmptyState
              iconName="Tag"
              title="No categories yet"
              description="Create your first category to organize your tasks"
              buttonText="Create Category"
              onButtonClick={() => setIsModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {categories.map((category, index) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    taskCount={getCategoryTaskCount(category.name)}
                    completedCount={getCategoryCompletedCount(category.name)}
                    completionPercentage={getCompletionPercentage(category.name)}
                    onEdit={openEditModal}
                    onDelete={handleDeleteCategory}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        category={editingCategory}
      />
    </div>
  );
};

export default CategoriesPage;