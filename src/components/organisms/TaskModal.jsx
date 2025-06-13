import Modal from '@/components/molecules/Modal';
import TaskForm from '@/components/organisms/TaskForm';
import { useState } from 'react';

const TaskModal = ({ isOpen, onClose, onSubmit, task, defaultDate }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose(); // Close modal on successful submission
    } catch (err) {
      console.error('Task submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    &lt;Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
    >
      &lt;TaskForm
        onSubmit={handleSubmit}
        task={task}
        defaultDate={defaultDate}
        loading={loading}
      />
    &lt;/Modal>
  );
};

export default TaskModal;