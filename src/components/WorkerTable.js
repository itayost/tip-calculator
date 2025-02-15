import React, { useState } from 'react';

export const WorkerTable = ({ 
  workers, 
  tipPerHour, 
  formatCurrency, 
  onEdit, 
  onDelete 
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (workerId) => {
    setActiveDropdown(activeDropdown === workerId ? null : workerId);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.worker-name')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Hours</th>
            <th>%</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => {
            const amount = worker.hours * worker.percentage * tipPerHour;
            return (
              <tr key={worker.id}>
                <td>
                  <div className="worker-name-container">
                    <button 
                      className="worker-name"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(worker.id);
                      }}
                    >
                      {worker.name}
                    </button>
                    {activeDropdown === worker.id && (
                      <div className="dropdown-menu">
                        <button 
                          onClick={() => {
                            onEdit(worker);
                            setActiveDropdown(null);
                          }}
                          className="dropdown-item"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            onDelete(worker.id);
                            setActiveDropdown(null);
                          }}
                          className="dropdown-item delete"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
                <td>{worker.hours}</td>
                <td>{worker.percentage === 0.7 ? '70%' : '100%'}</td>
                <td>{formatCurrency(amount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
  );
};