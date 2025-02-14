import React, { useState, useEffect } from 'react';

export const WorkerForm = ({ 
  editingId, 
  name, 
  setName, 
  hours, 
  setHours, 
  percentage, 
  setPercentage,
  errors,
  setErrors,
  handleSubmit,
  handleCancel,
  totalHours = 0
}) => {
  const [showWarning, setShowWarning] = useState(false);
  
  const validateField = (field, value) => {
    switch (field) {
      case 'hours':
        const numHours = parseFloat(value);
        if (isNaN(numHours)) {
          return 'Please enter a valid number';
        }
        if (numHours < 0) {
          return 'Hours cannot be negative';
        }
        if (numHours > 12) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
        break;
      case 'name':
        if (!value.trim()) {
          return 'Name is required';
        }
        if (value.length < 2) {
          return 'Name must be at least 2 characters';
        }
        break;
      default:
        break;
    }
    return null;
  };

  const handleFieldChange = (field, value, setter) => {
    const error = validateField(field, value);
    setter(value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleHoursChange = (e) => {
    let value = e.target.value;
    // Allow empty input and decimals
    if (value === '' || value === '.') {
      handleFieldChange('hours', value, setHours);
      return;
    }

    // Only allow numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    handleFieldChange('hours', value, setHours);
  };

  const formatHours = () => {
    if (hours === '' || hours === '.') return;
    
    const numValue = parseFloat(hours);
    if (!isNaN(numValue)) {
      // Round to nearest 0.25
      const roundedValue = (Math.round(numValue * 4) / 4).toFixed(2);
      handleFieldChange('hours', roundedValue, setHours);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-group">
      <h2>{editingId ? 'Edit Worker' : 'Add Worker'}</h2>
      <div className="form-content">
        <div className="form-field">
          <label htmlFor="workerName">Name</label>
          <input
            id="workerName"
            type="text"
            placeholder="Enter worker name"
            value={name}
            onChange={(e) => handleFieldChange('name', e.target.value, setName)}
            className={errors.name ? 'error' : ''}
            required
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        <div className="form-field">
          <label htmlFor="workerHours">Hours</label>
          <input
            id="workerHours"
            type="text"
            inputMode="decimal"
            placeholder="Enter hours (0.25, 0.5, 0.75, etc.)"
            value={hours}
            onChange={handleHoursChange}
            onBlur={formatHours}
            className={errors.hours ? 'error' : ''}
            required
          />
          {errors.hours && <div className="error-message">{errors.hours}</div>}
          {showWarning && !errors.hours && (
            <div className="warning-message">
              Warning: Hours entered seem high. Please verify.
            </div>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="workerPercentage">Role Percentage</label>
          <select
            id="workerPercentage"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          >
            <option value={1.0}>Server (100%)</option>
            <option value={0.7}>Support Staff (70%)</option>
          </select>
        </div>

        <div className="button-container">
          <button type="submit" disabled={Object.keys(errors).some(k => errors[k])}>
            {editingId ? 'Update Worker' : 'Add Worker'}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="delete-button"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};