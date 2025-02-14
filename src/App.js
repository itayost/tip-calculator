// src/App.js
import React, { useState } from 'react';
import { TipInput } from './components/TipInput';
import { WorkerForm } from './components/WorkerForm';
import { WorkerTable } from './components/WorkerTable';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateTipPerHour, formatCurrency } from './utils/calculations';
import './App.css';

function App() {
  const [{ workers, totalTips }, setTipData] = useLocalStorage('tipCalculatorData', {
    workers: [],
    totalTips: ''
  });
  
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');
  const [percentage, setPercentage] = useState(1.0);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  const validateInputs = () => ({
    ...(parseFloat(totalTips) < 0 && { totalTips: 'Tips cannot be negative' }),
    ...(parseFloat(hours) < 0 && { hours: 'Hours cannot be negative' }),
    ...(!name.trim() && { name: 'Name is required' })
  });

  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setTipData({ workers: [], totalTips: '' });
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setHours('');
    setPercentage(1.0);
    setErrors({});
    setEditingId(null);
  };

  const handleAddWorker = (e) => {
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
  };

  const handleUpdateWorker = (e) => {
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
          ? { ...worker, name, hours: parseFloat(hours), percentage: parseFloat(percentage) }
          : worker
      )
    }));
    resetForm();
  };

  const handleDeleteWorker = (workerId) => {
    if (window.confirm('Are you sure you want to remove this worker?')) {
      setTipData(prev => ({
        ...prev,
        workers: prev.workers.filter(worker => worker.id !== workerId)
      }));
    }
  };

  const handleEditWorker = (worker) => {
    setEditingId(worker.id);
    setName(worker.name);
    setHours(worker.hours.toString());
    setPercentage(worker.percentage);
  };

  const tipPerHour = calculateTipPerHour(workers, totalTips);
  const totalEffectiveHours = workers.reduce(
    (sum, worker) => sum + worker.hours * worker.percentage,
    0
  );

  return (
    <div className="container">
      <div className="header-container">
        <h1>Restaurant Tip Calculator</h1>
        <button 
          onClick={handleResetAll}
          className="delete-button"
        >
          Reset All Data
        </button>
      </div>
      
      <TipInput
        totalTips={totalTips}
        setTotalTips={(value) => setTipData(prev => ({ ...prev, totalTips: value }))}
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
      />

      {workers.length > 0 && (
        <div>
          <h2>Distribution</h2>
          <WorkerTable
            workers={workers}
            tipPerHour={tipPerHour}
            formatCurrency={formatCurrency}
            onEdit={handleEditWorker}
            onDelete={handleDeleteWorker}
          />
          
          <div className="summary">
            <p>Total Effective Hours: {totalEffectiveHours.toFixed(2)}</p>
            <p>Tip per Effective Hour: {formatCurrency(tipPerHour)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;