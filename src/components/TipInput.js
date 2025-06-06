import React, { useState, useEffect, useCallback } from 'react';

export const TipInput = ({ totalTips, setTotalTips, errors, setErrors }) => {
  const [displayValue, setDisplayValue] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Format number as currency
  const formatAsCurrency = useCallback((value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }, []);

  // Handle input change with validation
  const handleTipChange = useCallback((e) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    setDisplayValue(rawValue);
    
    // Validate input
    let error = null;
    const numValue = parseFloat(rawValue);
    
    if (rawValue === '') {
      error = 'נא להזין סכום טיפים';
    } else if (isNaN(numValue)) {
      error = 'נא להזין מספר תקין';
    } else if (numValue < 0) {
      error = 'טיפים לא יכולים להיות שליליים';
    } else if (numValue === 0) {
      error = 'סכום הטיפים לא יכול להיות אפס';
    } else if (numValue > 100000) {
      error = 'הסכום נראה גבוה מדי';
    }

    // Show warning for unusual amounts
    setShowWarning(numValue > 10000 && numValue <= 100000);

    // Update parent state
    setTotalTips(rawValue);
    setErrors(prev => ({ ...prev, totalTips: error }));
  }, [setTotalTips, setErrors]);

  // Clear input
  const handleClear = useCallback(() => {
    setDisplayValue('');
    setTotalTips('');
    setErrors(prev => ({ ...prev, totalTips: 'נא להזין סכום טיפים' }));
    setShowWarning(false);
    
    // Focus back on input after clearing
    document.getElementById('totalTips')?.focus();
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  }, [setTotalTips, setErrors]);

  // Format display value when input loses focus
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (displayValue && !errors.totalTips) {
      const num = parseFloat(displayValue);
      if (!isNaN(num)) {
        // Don't format in the input, just validate
        setDisplayValue(num.toString());
      }
    }
  }, [displayValue, errors.totalTips]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    // Select all text on focus for easy replacement
    setTimeout(() => {
      document.getElementById('totalTips')?.select();
    }, 50);
  }, []);

  // Update display value when totalTips changes externally
  useEffect(() => {
    if (!isFocused && totalTips !== displayValue) {
      setDisplayValue(totalTips);
    }
  }, [totalTips, isFocused, displayValue]);

  return (
    <div className="tip-input-container">
      <div className="input-group">
        <div className="form-field">
          <label htmlFor="totalTips">סכום טיפים לחלוקה</label>
          
          {/* Input field with clear button */}
          <div className="input-wrapper">
            <input
              id="totalTips"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              value={displayValue}
              onChange={handleTipChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="0"
              className={`tip-input ${errors.totalTips ? 'error' : ''}`}
              aria-label="סכום טיפים"
              aria-invalid={!!errors.totalTips}
              aria-describedby={errors.totalTips ? 'totalTips-error' : undefined}
            />
            
            {/* Clear button */}
            {displayValue && (
              <button
                type="button"
                className="clear-btn"
                onClick={handleClear}
                aria-label="נקה סכום"
              >
                ✕
              </button>
            )}
          </div>

          {/* Error message */}
          {errors.totalTips && (
            <div 
              id="totalTips-error" 
              className="error-message fade-in"
              role="alert"
            >
              {errors.totalTips}
            </div>
          )}
          
          {/* Warning message */}
          {showWarning && !errors.totalTips && (
            <div 
              className="warning-message fade-in"
              role="alert"
            >
              הסכום נראה גבוה. אנא ודא שהסכום נכון.
            </div>
          )}

          {/* Helper text showing formatted amount */}
          {displayValue && !errors.totalTips && !showWarning && (
            <div className="helper-text">
              {formatAsCurrency(displayValue)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};