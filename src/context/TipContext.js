// src/context/TipContext.js
import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateTipPerHour } from '../utils/calculations';
import { validateWorkerInput, validateTipAmount } from '../utils/validators';

const TipContext = createContext();

export const useTipContext = () => {
  const context = useContext(TipContext);
  if (!context) {
    throw new Error('useTipContext must be used within a TipProvider');
  }
  return context;
};

export const TipProvider = ({ children }) => {
  // State management with localStorage persistence
  const [{ workers, totalTips }, setTipData] = useLocalStorage('tipCalculatorData', {
    workers: [],
    totalTips: ''
  });

  // Add worker
  const addWorker = useCallback((workerData) => {
    const validation = validateWorkerInput(workerData, workers);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const newWorker = {
      id: Date.now(),
      name: workerData.name.trim(),
      hours: parseFloat(workerData.hours),
      percentage: parseFloat(workerData.percentage)
    };

    setTipData(prev => ({
      ...prev,
      workers: [...prev.workers, newWorker]
    }));

    return { success: true };
  }, [workers, setTipData]);

  // Update worker
  const updateWorker = useCallback((workerId, workerData) => {
    const validation = validateWorkerInput(workerData, workers, workerId);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    setTipData(prev => ({
      ...prev,
      workers: prev.workers.map(worker =>
        worker.id === workerId
          ? {
              ...worker,
              name: workerData.name.trim(),
              hours: parseFloat(workerData.hours),
              percentage: parseFloat(workerData.percentage)
            }
          : worker
      )
    }));

    return { success: true };
  }, [workers, setTipData]);

  // Delete worker
  const deleteWorker = useCallback((workerId) => {
    setTipData(prev => ({
      ...prev,
      workers: prev.workers.filter(w => w.id !== workerId)
    }));
  }, [setTipData]);

  // Update total tips
  const updateTotalTips = useCallback((amount) => {
    const validation = validateTipAmount(amount);
    
    setTipData(prev => ({
      ...prev,
      totalTips: amount
    }));

    return validation;
  }, [setTipData]);

  // Reset all data
  const resetAllData = useCallback(() => {
    setTipData({ workers: [], totalTips: '' });
  }, [setTipData]);

  // Memoized calculations
  const calculations = useMemo(() => {
    const tipPerHour = calculateTipPerHour(workers, totalTips);
    const totalHours = workers.reduce((sum, worker) => sum + worker.hours, 0);
    const totalEffectiveHours = workers.reduce(
      (sum, worker) => sum + worker.hours * worker.percentage,
      0
    );
    const totalDistributed = workers.reduce(
      (sum, worker) => sum + (worker.hours * worker.percentage * tipPerHour),
      0
    );
    const tips = parseFloat(totalTips) || 0;
    const hasDiscrepancy = Math.abs(tips - totalDistributed) > 0.01;
    const discrepancy = tips - totalDistributed;

    return {
      tipPerHour,
      totalHours,
      totalEffectiveHours,
      totalDistributed,
      hasDiscrepancy,
      discrepancy,
      tipPerHour70: tipPerHour * 0.7
    };
  }, [workers, totalTips]);

  // Worker statistics
  const workerStats = useMemo(() => {
    return {
      total: workers.length,
      workers100: workers.filter(w => w.percentage === 1).length,
      workers70: workers.filter(w => w.percentage === 0.7).length
    };
  }, [workers]);

  const value = {
    // State
    workers,
    totalTips,
    
    // Actions
    addWorker,
    updateWorker,
    deleteWorker,
    updateTotalTips,
    resetAllData,
    
    // Calculations
    calculations,
    workerStats
  };

  return <TipContext.Provider value={value}>{children}</TipContext.Provider>;
};