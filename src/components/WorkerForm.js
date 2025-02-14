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
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <label htmlFor="workerName" className="block text-sm font-medium mb-1">Name</label>
        <input
          id="workerName"
          type="text"
          placeholder="Enter worker name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors({...errors, name: null});
          }}
          className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
          required
        />
        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
      </div>
      
      <div className="w-full">
        <label htmlFor="workerHours" className="block text-sm font-medium mb-1">Hours</label>
        <input
          id="workerHours"
          type="number"
          placeholder="Hours worked"
          value={hours}
          onChange={(e) => {
            setHours(e.target.value);
            setErrors({...errors, hours: null});
          }}
          min="0"
          step="0.5"
          className={`w-full p-3 border rounded-lg ${errors.hours ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
          required
        />
        {errors.hours && <div className="text-red-500 text-sm mt-1">{errors.hours}</div>}
      </div>

      <div className="w-full">
        <label htmlFor="workerPercentage" className="block text-sm font-medium mb-1">Percentage</label>
        <select
          id="workerPercentage"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg bg-white"
        >
          <option value={1.0}>100%</option>
          <option value={0.7}>70%</option>
        </select>
      </div>

      <div className="button-container flex flex-col sm:flex-row gap-2 w-full">
        <td className="actions">
          <button 
            type="submit"
            className="w-full sm:w-auto flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {editingId ? 'Update Worker' : 'Add Worker'}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="w-full sm:w-auto flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              Cancel
            </button>
          )}
        </td>
      </div>
    </div>
  </form>
);

export default WorkerForm;