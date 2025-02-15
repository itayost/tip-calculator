import React, { useState } from 'react';
import { TipInput } from './components/TipInput';
import { WorkerForm } from './components/WorkerForm';
import { WorkerTable } from './components/WorkerTable';
import PrintSummary from './components/PrintSummary';
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
      resetForm();
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
    (sum, worker) => sum + worker.hours,
    0
  );

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Tip Calculator</h1>
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
        <div className="results-section">
          <div className="summary">
          <div className="section-header">
            <h2>Distribution</h2>
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
            <p>Total Hours: {totalEffectiveHours.toFixed(2)}</p>
            <p>100% per Hour: {formatCurrency(tipPerHour)}</p>
            <p>70% per Hour: {formatCurrency(tipPerHour * 0.7)}</p>
            <div className="button-container">
              <button 
                onClick={() => window.print()}
                className="print-button"
              >
                Print Summary
              </button>
            </div>
          </div>

          <PrintSummary 
            workers={workers}
            totalTips={totalTips}
            tipPerHour={tipPerHour}
            formatCurrency={formatCurrency}
          />
          
          <div className="button-container">
            <button 
              onClick={handleResetAll}
              className="delete-button"
            >
              Reset All Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;