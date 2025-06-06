// src/hooks/useWorkers.js
import { useState, useCallback } from 'react';
import { useTipContext } from '../context/TipContext';
import { formatCurrency } from '../utils/formatters';
import { APP_CONFIG, MESSAGES } from '../constants';

export const useWorkers = () => {
  const { 
    workers, 
    addWorker, 
    updateWorker, 
    deleteWorker, 
    calculations,
    resetAllData 
  } = useTipContext();
  
  const [editingId, setEditingId] = useState(null);

  // Handle add worker
  const handleAddWorker = useCallback((workerData) => {
    const result = addWorker(workerData);
    
    if (result.success) {
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(APP_CONFIG.VIBRATION_DURATION);
      }
    }
    
    return result;
  }, [addWorker]);

  // Handle update worker
  const handleUpdateWorker = useCallback((workerData) => {
    if (!editingId) return { success: false, errors: {} };
    
    const result = updateWorker(editingId, workerData);
    
    if (result.success) {
      setEditingId(null);
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(APP_CONFIG.VIBRATION_DURATION);
      }
    }
    
    return result;
  }, [editingId, updateWorker]);

  // Handle delete with confirmation
  const handleDeleteWorker = useCallback((workerId) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;
    
    const workerTips = worker.hours * worker.percentage * calculations.tipPerHour;
    const message = MESSAGES.CONFIRMATIONS.DELETE_WORKER(
      worker.name, 
      formatCurrency(workerTips)
    );
    
    if (window.confirm(message)) {
      deleteWorker(workerId);
      
      // Clear form if we were editing this worker
      if (editingId === workerId) {
        setEditingId(null);
      }
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(APP_CONFIG.VIBRATION_DELETE);
      }
    }
  }, [workers, calculations.tipPerHour, deleteWorker, editingId]);

  // Handle edit
  const handleEditWorker = useCallback((worker) => {
    setEditingId(worker.id);
    
    // Smooth scroll to form on mobile
    setTimeout(() => {
      const formElement = document.querySelector('.worker-form');
      if (formElement && window.innerWidth <= 768) {
        formElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
    
    return worker;
  }, []);

  // Handle reset all with confirmation
  const handleResetAll = useCallback(() => {
    const message = MESSAGES.CONFIRMATIONS.RESET_ALL(workers.length);
    
    if (window.confirm(message)) {
      resetAllData();
      setEditingId(null);
    }
  }, [workers.length, resetAllData]);

  // Cancel editing
  const cancelEditing = useCallback(() => {
    setEditingId(null);
  }, []);

  // Get worker being edited
  const getEditingWorker = useCallback(() => {
    return workers.find(w => w.id === editingId) || null;
  }, [workers, editingId]);

  return {
    workers,
    editingId,
    handleAddWorker,
    handleUpdateWorker,
    handleDeleteWorker,
    handleEditWorker,
    handleResetAll,
    cancelEditing,
    getEditingWorker,
    calculations
  };
};

// src/hooks/index.js
export { useLocalStorage } from './useLocalStorage';
export { useWorkers } from './useWorkers';