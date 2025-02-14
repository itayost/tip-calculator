import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [totalTips, setTotalTips] = useState('');
  const [workers, setWorkers] = useState([]);
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');
  const [percentage, setPercentage] = useState(1.0);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('tipCalculatorData');
    if (savedData) {
      const { workers, totalTips } = JSON.parse(savedData);
      setWorkers(workers);
      setTotalTips(totalTips);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('tipCalculatorData', JSON.stringify({
      workers,
      totalTips
    }));
  }, [workers, totalTips]);

  const validateInputs = () => {
    const newErrors = {};
    if (parseFloat(totalTips) < 0) newErrors.totalTips = 'Tips cannot be negative';
    if (parseFloat(hours) < 0) newErrors.hours = 'Hours cannot be negative';
    if (!name.trim()) newErrors.name = 'Name is required';
    return newErrors;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
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
    
    setWorkers([...workers, newWorker]);
    setName('');
    setHours('');
    setPercentage(1.0);
    setErrors({});
  };

  const handleDeleteWorker = (workerId) => {
    if (window.confirm('Are you sure you want to remove this worker?')) {
      setWorkers(workers.filter(worker => worker.id !== workerId));
    }
  };

  const handleEditWorker = (worker) => {
    setEditingId(worker.id);
    setName(worker.name);
    setHours(worker.hours.toString());
    setPercentage(worker.percentage);
  };

  const handleUpdateWorker = (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setWorkers(workers.map(worker => 
      worker.id === editingId 
        ? { ...worker, name, hours: parseFloat(hours), percentage: parseFloat(percentage) }
        : worker
    ));

    setEditingId(null);
    setName('');
    setHours('');
    setPercentage(1.0);
    setErrors({});
  };

  const totalEffectiveHours = workers.reduce(
    (sum, worker) => sum + worker.hours * worker.percentage,
    0
  );

  const tipPerHour = totalEffectiveHours > 0 
    ? (parseFloat(totalTips) || 0) / totalEffectiveHours 
    : 0;

  return (
    <div className="container">
      <h1>Restaurant Tip Calculator</h1>
      
      <div className="input-group">
        <div className="label-wrapper">
          <label>Total Tips Earned:</label>
          <input
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

      <form onSubmit={editingId ? handleUpdateWorker : handleAddWorker} className="input-group">
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
              onClick={() => {
                setEditingId(null);
                setName('');
                setHours('');
                setPercentage(1.0);
                setErrors({});
              }}
              className="cancel-button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {workers.length > 0 && (
        <div>
          <h2>Distribution</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Hours</th>
                <th>Percentage</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => {
                const amount = worker.hours * worker.percentage * tipPerHour;
                return (
                  <tr key={worker.id}>
                    <td>{worker.name}</td>
                    <td>{worker.hours}</td>
                    <td>{worker.percentage === 0.7 ? '70%' : '100%'}</td>
                    <td>{formatCurrency(amount)}</td>
                    <td className="actions">
                      <button 
                        onClick={() => handleEditWorker(worker)}
                        className="edit-button"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteWorker(worker.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="summary">
            <p>Total Effective Hours: {totalEffectiveHours.toFixed(2)}</p>
            <p>Tip per Effective Hour: {formatCurrency(tipPerHour)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;