import React from 'react';

export const TipInput = ({ totalTips, setTotalTips, errors, setErrors }) => (
  <div className="input-group">
    <div className="tip-input-wrapper">
      <label htmlFor="totalTips">Total Tips Earned:</label>
      <input
        id="totalTips"
        type="number"
        value={totalTips}
        onChange={(e) => {
          setTotalTips(e.target.value);
          setErrors({...errors, totalTips: null});
        }}
        placeholder="Enter total tips"
        className={errors.totalTips ? 'error' : ''}
      />
    </div>
    {errors.totalTips && <div className="error-message">{errors.totalTips}</div>}
  </div>
);