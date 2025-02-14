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
    <div className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_auto] gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="workerName" className="text-sm font-medium">Name</label>
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
      
      <div className="flex flex-col gap-2">
        <label htmlFor="workerHours" className="text-sm font-medium">Hours</label>
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

      <div className="flex flex-col gap-2">
        <label htmlFor="workerPercentage" className="text-sm font-medium">Percentage</label>
        <select
          id="workerPercentage"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg"
        >
          <option value={1.0}>100%</option>
          <option value={0.7}>70%</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:self-end">
        <button 
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {editingId ? 'Update Worker' : 'Add Worker'}
        </button>
        
        {editingId && (
          <button 
            type="button" 
            onClick={handleCancel}
            className="w-full md:w-auto px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  </form>
);

export default WorkerForm;