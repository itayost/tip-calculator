import React from 'react';

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
  handleCancel 
}) => (
  <form onSubmit={handleSubmit} className="input-group">
    <h2>{editingId ? 'Edit Worker' : 'Add Worker'}</h2>
    <div className="form-row">
      <div className="input-field">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors({...errors, name: null});
          }}
          className={errors.name ? 'error' : ''}
          required
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>
      
      <div className="input-field">
        <input
          type="number"
          placeholder="Hours"
          value={hours}
          onChange={(e) => {
            setHours(e.target.value);
            setErrors({...errors, hours: null});
          }}
          min="0"
          step="0.5"
          className={errors.hours ? 'error' : ''}
          required
        />
        {errors.hours && <div className="error-message">{errors.hours}</div>}
      </div>

      <select
        value={percentage}
        onChange={(e) => setPercentage(e.target.value)}
      >
        <option value={1.0}>100%</option>
        <option value={0.7}>70%</option>
      </select>

      <button type="submit">
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
  </form>
);