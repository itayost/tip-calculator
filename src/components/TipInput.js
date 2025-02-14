import React, { useState, useEffect } from 'react';

export const TipInput = ({ totalTips, setTotalTips, errors, setErrors }) => {
  const [displayValue, setDisplayValue] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  // Format number as currency
  const formatAsCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(num);
  };

  // Handle real-time validation and formatting
  const handleTipChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    setDisplayValue(rawValue);
    
    // Validate input
    let error = null;
    const numValue = parseFloat(rawValue);
    
    if (rawValue === '') {
      error = 'Total tips is required';
    } else if (isNaN(numValue)) {
      error = 'Please enter a valid number';
    } else if (numValue < 0) {
      error = 'Tips cannot be negative';
    } else if (numValue === 0) {
      error = 'Tips cannot be zero';
    } else if (numValue > 100000) {
      error = 'Amount seems unusually high';
    }

    // Show warning for unusual amounts
    setShowWarning(numValue > 10000 && numValue <= 100000);

    // Update parent state
    setTotalTips(rawValue);
    setErrors(prev => ({ ...prev, totalTips: error }));
  };

  // Format the display value when component mounts or totalTips changes
  useEffect(() => {
    if (!totalTips) {
      setDisplayValue('');
    } else if (displayValue !== totalTips) {
      setDisplayValue(totalTips);
    }
  }, [totalTips]);

  return (
    <div className="input-group">
      <div className="form-field">
        <label htmlFor="totalTips">Total Tips Earned</label>
        <div className="tip-input-container">
          <input
            id="totalTips"
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleTipChange}
            placeholder="0"
            className={errors.totalTips ? 'error' : ''}
          />
          {displayValue && !errors.totalTips && (
            <div className="formatted-value">
              {formatAsCurrency(displayValue)}
            </div>
          )}
        </div>
        {errors.totalTips && (
          <div className="error-message">{errors.totalTips}</div>
        )}
        {showWarning && !errors.totalTips && (
          <div className="warning-message">
            This amount seems high. Please verify the total.
          </div>
        )}
      </div>
    </div>
  );
};