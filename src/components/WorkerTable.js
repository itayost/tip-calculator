import React from 'react';

export const WorkerTable = ({ 
  workers, 
  tipPerHour, 
  formatCurrency, 
  onEdit, 
  onDelete 
}) => (
  <div className="table-container">
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
              <td>
                <div className="table-actions">
                  <button 
                    onClick={() => onEdit(worker)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(worker.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);