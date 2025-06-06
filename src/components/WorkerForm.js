import React, { useCallback } from 'react';

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
  // Validate field
  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) {
          return 'נא להזין שם';
        }
        if (value.trim().length < 2) {
          return 'שם חייב להכיל לפחות 2 תווים';
        }
        break;
      case 'hours':
        const numHours = parseFloat(value);
        if (value === '' || isNaN(numHours)) {
          return 'נא להזין שעות';
        }
        if (numHours <= 0) {
          return 'שעות חייבות להיות גדולות מ-0';
        }
        if (numHours > 24) {
          return 'שעות לא יכולות לעלות על 24';
        }
        break;
      default:
        break;
    }
    return null;
  }, []);

  // Handle field change
  const handleFieldChange = useCallback((field, value, setter) => {
    const error = validateField(field, value);
    setter(value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, [validateField, setErrors]);

  // Handle hours input change
  const handleHoursChange = useCallback((e) => {
    const value = e.target.value;
    handleFieldChange('hours', value, setHours);
  }, [handleFieldChange, setHours]);

  // Toggle percentage
  const togglePercentage = useCallback(() => {
    const newPercentage = percentage === 1.0 ? 0.7 : 1.0;
    setPercentage(newPercentage);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  }, [percentage, setPercentage]);

  // Form submission
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    handleSubmit(e);
  }, [handleSubmit]);

  return (
    <form onSubmit={onSubmit} className="worker-form input-group">
      <h2>{editingId ? 'עריכת עובד' : 'הוספת עובד'}</h2>
      
      <div className="form-content">
        {/* Name Input */}
        <div className="form-field">
          <label htmlFor="workerName">שם העובד</label>
          <input
            id="workerName"
            type="text"
            placeholder="הכנס שם"
            value={name}
            onChange={(e) => handleFieldChange('name', e.target.value, setName)}
            className={errors.name ? 'error' : ''}
            autoCapitalize="words"
            autoComplete="off"
            required
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>
        
        {/* Hours Input */}
        <div className="form-field">
          <label htmlFor="workerHours">שעות עבודה</label>
          <input
            id="workerHours"
            type="number"
            step="0.25"
            min="0"
            max="24"
            placeholder="0"
            value={hours}
            onChange={handleHoursChange}
            className={errors.hours ? 'error' : ''}
            required
          />
          {errors.hours && <div className="error-message">{errors.hours}</div>}
          <div className="helper-text">ניתן להזין רבעי שעה (0.25, 0.5, 0.75)</div>
        </div>

        {/* Percentage Toggle */}
        <div className="form-field">
          <label>אחוז טיפ</label>
          <div className="percentage-toggle">
            <button
              type="button"
              className={`toggle-option ${percentage === 1.0 ? 'active' : ''}`}
              onClick={() => percentage !== 1.0 && togglePercentage()}
            >
              100%
              <span className="toggle-label">מלצר</span>
            </button>
            <button
              type="button"
              className={`toggle-option ${percentage === 0.7 ? 'active' : ''}`}
              onClick={() => percentage !== 0.7 && togglePercentage()}
            >
              70%
              <span className="toggle-label">עוזר</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="button-container">
          <button 
            type="submit" 
            disabled={Object.keys(errors).some(k => errors[k])}
            className="submit-btn"
          >
            {editingId ? 'עדכן עובד' : 'הוסף עובד'}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-btn"
            >
              ביטול
            </button>
          )}
        </div>
      </div>
    </form>
  );
};