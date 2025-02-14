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
  totalHours = 0 // New prop to track total hours
}) => {
  const [showWarning, setShowWarning] = useState(false);
  
  // Enhanced validation with warnings
  const validateField = (field, value) => {
    switch (field) {
      case 'hours':
        const numHours = parseFloat(value);
        if (numHours > 12) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
        if (numHours < 0) {
          return 'Hours cannot be negative';
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

  // Real-time validation
  const handleFieldChange = (field, value, setter) => {
    const error = validateField(field, value);
    setter(value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
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
            type="number"
            placeholder="Hours worked"
            value={hours}
            onChange={(e) => handleFieldChange('hours', e.target.value, setHours)}
            min="0"
            step="0.5"
            className={errors.hours ? 'error' : ''}
            required
          />
          {errors.hours && <div className="error-message">{errors.hours}</div>}
          {showWarning && !errors.hours && (
            <div className="warning-message">
              Warning: Hours entered seem high. Please verify.
            </div>
          )}
          <div className="info-message">
            Total shift hours: {totalHours} hours
          </div>
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
              className="cancel-button"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};