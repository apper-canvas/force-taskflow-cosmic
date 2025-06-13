import Modal from '@/components/molecules/Modal';
import CategoryForm from '@/components/organisms/CategoryForm';
import { useState } from 'react';

const CategoryModal = ({ isOpen, onClose, onSubmit, category }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error('Category submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    &lt;Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Create New Category'}
    >
      &lt;CategoryForm
        onSubmit={handleSubmit}
        category={category}
        loading={loading}
      />
    &lt;/Modal>
  );
};

export default CategoryModal;