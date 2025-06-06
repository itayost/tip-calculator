import React, { useState, useCallback, useMemo } from 'react';
import { TipInput } from './components/TipInput';
import { WorkerForm } from './components/WorkerForm';
import { WorkerTable } from './components/WorkerTable';
import { PDFExport } from './components/PDFExport';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateTipPerHour, formatCurrency } from './utils/calculations';
import './App.css';

function App() {
  // State management with localStorage persistence
  const [{ workers, totalTips }, setTipData] = useLocalStorage('tipCalculatorData', {
    workers: [],
    totalTips: ''
  });
  
  // Form state
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');
  const [percentage, setPercentage] = useState(1.0);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Enhanced validation with better error messages
  const validateInputs = useCallback(() => {
    const validationErrors = {};
    
    // Check total tips
    if (!totalTips || parseFloat(totalTips) <= 0) {
      validationErrors.totalTips = 'נא להזין סכום טיפים';
    }
    
    // Check name
    if (!name.trim()) {
      validationErrors.name = 'נא להזין שם';
    } else if (name.trim().length < 2) {
      validationErrors.name = 'שם חייב להכיל לפחות 2 תווים';
    } else if (!editingId && workers.some(w => 
      w.name.toLowerCase() === name.trim().toLowerCase()
    )) {
      validationErrors.name = 'עובד עם שם זה כבר קיים';
    }
    
    // Check hours
    const hoursNum = parseFloat(hours);
    if (!hours || isNaN(hoursNum)) {
      validationErrors.hours = 'נא להזין שעות';
    } else if (hoursNum <= 0) {
      validationErrors.hours = 'שעות חייבות להיות גדולות מ-0';
    } else if (hoursNum > 24) {
      validationErrors.hours = 'שעות לא יכולות לעלות על 24';
    }
    
    return validationErrors;
  }, [totalTips, name, hours, workers, editingId]);

  // Reset form with useCallback for performance
  const resetForm = useCallback(() => {
    setName('');
    setHours('');
    setPercentage(1.0);
    setErrors({});
    setEditingId(null);
  }, []);

  // Enhanced reset all with worker count
  const handleResetAll = useCallback(() => {
    const message = workers.length > 0 
      ? `האם אתה בטוח שברצונך לאפס את כל הנתונים?\nפעולה זו תמחק ${workers.length} עובדים ולא ניתן לבטלה.`
      : 'האם אתה בטוח שברצונך לאפס את כל הנתונים?';
      
    if (window.confirm(message)) {
      setTipData({ workers: [], totalTips: '' });
      resetForm();
    }
  }, [workers.length, setTipData, resetForm]);

  // Add worker with enhanced validation
  const handleAddWorker = useCallback((e) => {
    e.preventDefault();
    
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const newWorker = {
      id: Date.now(),
      name: name.trim(),
      hours: parseFloat(hours),
      percentage: parseFloat(percentage)
    };
    
    setTipData(prev => ({
      ...prev,
      workers: [...prev.workers, newWorker]
    }));
    
    resetForm();
    
    // Vibrate on success (mobile)
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [name, hours, percentage, validateInputs, setTipData, resetForm]);

  // Update worker with validation
  const handleUpdateWorker = useCallback((e) => {
    e.preventDefault();
    
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setTipData(prev => ({
      ...prev,
      workers: prev.workers.map(worker => 
        worker.id === editingId 
          ? { 
              ...worker, 
              name: name.trim(), 
              hours: parseFloat(hours), 
              percentage: parseFloat(percentage) 
            }
          : worker
      )
    }));
    
    resetForm();
    
    // Vibrate on success
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [editingId, name, hours, percentage, validateInputs, setTipData, resetForm]);

  // Enhanced delete with tip amount in confirmation
  const handleDeleteWorker = useCallback((workerId) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;
    
    const tipPerHour = calculateTipPerHour(workers, totalTips);
    const workerTips = worker.hours * worker.percentage * tipPerHour;
    
    const message = `האם אתה בטוח שברצונך למחוק את ${worker.name}?\n` +
                   `העובד אמור לקבל ${formatCurrency(workerTips)} בטיפים.`;
    
    if (window.confirm(message)) {
      setTipData(prev => ({
        ...prev,
        workers: prev.workers.filter(w => w.id !== workerId)
      }));
      
      // Clear form if we were editing this worker
      if (editingId === workerId) {
        resetForm();
      }
      
      // Vibrate on delete
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
    }
  }, [workers, totalTips, editingId, setTipData, resetForm]);

  // Edit worker with mobile scroll
  const handleEditWorker = useCallback((worker) => {
    setEditingId(worker.id);
    setName(worker.name);
    setHours(worker.hours.toString());
    setPercentage(worker.percentage);
    setErrors({});
    
    // Smooth scroll to form on mobile
    setTimeout(() => {
      const formElement = document.querySelector('.input-group');
      if (formElement && window.innerWidth <= 768) {
        formElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  }, []);

  // Memoized calculations for performance
  const tipPerHour = useMemo(() => 
    calculateTipPerHour(workers, totalTips), 
    [workers, totalTips]
  );
  
  const totalHours = useMemo(() => 
    workers.reduce((sum, worker) => sum + worker.hours, 0), 
    [workers]
  );
  
  const totalDistributed = useMemo(() => 
    workers.reduce((sum, worker) => 
      sum + (worker.hours * worker.percentage * tipPerHour), 0
    ), 
    [workers, tipPerHour]
  );
  
  // Check if there's a difference between input and distributed
  const hasDiscrepancy = useMemo(() => {
    const tips = parseFloat(totalTips) || 0;
    return Math.abs(tips - totalDistributed) > 0.01;
  }, [totalTips, totalDistributed]);

  // Update total tips with validation
  const handleSetTotalTips = useCallback((value) => {
    setTipData(prev => ({ ...prev, totalTips: value }));
    // Clear totalTips error when user starts typing
    if (errors.totalTips && value) {
      setErrors(prev => ({ ...prev, totalTips: null }));
    }
  }, [setTipData, errors.totalTips, setErrors]);

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>מחשבון טיפים</h1>
      </div>
      
      <TipInput
        totalTips={totalTips}
        setTotalTips={handleSetTotalTips}
        errors={errors}
        setErrors={setErrors}
      />

      <WorkerForm
        editingId={editingId}
        name={name}
        setName={setName}
        hours={hours}
        setHours={setHours}
        percentage={percentage}
        setPercentage={setPercentage}
        errors={errors}
        setErrors={setErrors}
        handleSubmit={editingId ? handleUpdateWorker : handleAddWorker}
        handleCancel={resetForm}
        totalHours={totalHours}
      />

      {workers.length > 0 && (
        <div className="results-section">
          <div className="summary">
            <div className="section-header">
              <h2>חלוקת טיפים</h2>
            </div>
            
            <div className="table-container">
              <WorkerTable
                workers={workers}
                tipPerHour={tipPerHour}
                formatCurrency={formatCurrency}
                onEdit={handleEditWorker}
                onDelete={handleDeleteWorker}
              />
            </div>
            
            <div className="summary-stats">
              <p>
                <span>סה"כ שעות:</span>
                <strong>{totalHours.toFixed(2)}</strong>
              </p>
              <p>
                <span>טיפ לשעה 100%:</span>
                <strong>{formatCurrency(tipPerHour)}</strong>
              </p>
              <p>
                <span>טיפ לשעה 70%:</span>
                <strong>{formatCurrency(tipPerHour * 0.7)}</strong>
              </p>
              <p>
                <span>סה"כ חולק:</span>
                <strong>{formatCurrency(totalDistributed)}</strong>
              </p>
              {hasDiscrepancy && (
                <p className="warning">
                  <span>הפרש:</span>
                  <strong>{formatCurrency(parseFloat(totalTips) - totalDistributed)}</strong>
                </p>
              )}
            </div>
            
            <div className="button-container">
              <PDFExport 
                workers={workers}
                totalTips={totalTips}
                tipPerHour={tipPerHour}
              />
              <button 
                className="delete-button"
                onClick={handleResetAll}
              >
                אפס הכל
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;