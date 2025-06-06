import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';

export const WorkerTable = ({ 
  workers, 
  tipPerHour, 
  formatCurrency, 
  onEdit, 
  onDelete 
}) => {
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  // Open bottom sheet
  const openBottomSheet = useCallback((worker, event) => {
    event.stopPropagation();
    setSelectedWorker(worker);
    setShowBottomSheet(true);
    
    // Add class to app container
    document.querySelector('.app-container')?.classList.add('bottom-sheet-open');
    
    // Prevent body scroll when sheet is open - iOS fix
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  }, []);

  // Close bottom sheet
  const closeBottomSheet = useCallback(() => {
    setShowBottomSheet(false);
    setTimeout(() => setSelectedWorker(null), 300); // Clear after animation
    
    // Remove class from app container
    document.querySelector('.app-container')?.classList.remove('bottom-sheet-open');
    
    // Restore body scroll - iOS fix
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }, []);

  // Handle action selection
  const handleAction = useCallback((action) => {
    if (!selectedWorker) return;
    
    if (action === 'edit') {
      onEdit(selectedWorker);
    } else if (action === 'delete') {
      onDelete(selectedWorker.id);
    }
    
    closeBottomSheet();
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  }, [selectedWorker, onEdit, onDelete, closeBottomSheet]);

  // Calculate totals
  const totals = workers.reduce((acc, worker) => {
    const amount = worker.hours * worker.percentage * tipPerHour;
    return {
      hours: acc.hours + worker.hours,
      amount: acc.amount + amount,
      workers100: acc.workers100 + (worker.percentage === 1 ? 1 : 0),
      workers70: acc.workers70 + (worker.percentage === 0.7 ? 1 : 0)
    };
  }, { hours: 0, amount: 0, workers100: 0, workers70: 0 });

  // Render bottom sheet using React Portal
  const renderBottomSheet = () => {
    if (!showBottomSheet) return null;

    return ReactDOM.createPortal(
      <>
        <div 
          className="bottom-sheet-backdrop"
          onClick={closeBottomSheet}
        />
        <div className={`bottom-sheet ${showBottomSheet ? 'open' : ''}`}>
          <div className="bottom-sheet-handle" />
          
          {selectedWorker && (
            <>
              <div className="bottom-sheet-header">
                <h3>{selectedWorker.name}</h3>
                <p className="worker-details">
                  {selectedWorker.hours} שעות • {selectedWorker.percentage === 1 ? '100%' : '70%'}
                </p>
                <p className="worker-amount">
                  {formatCurrency(selectedWorker.hours * selectedWorker.percentage * tipPerHour)}
                </p>
              </div>
              
              <div className="bottom-sheet-actions">
                <button 
                  onClick={() => handleAction('edit')}
                  className="sheet-action-btn edit"
                >
                  <span className="action-icon">✏️</span>
                  <span>ערוך פרטי עובד</span>
                </button>
                
                <button 
                  onClick={() => handleAction('delete')}
                  className="sheet-action-btn delete"
                >
                  <span className="action-icon">🗑️</span>
                  <span>מחק עובד</span>
                </button>
                
                <button 
                  onClick={closeBottomSheet}
                  className="sheet-action-btn cancel"
                >
                  ביטול
                </button>
              </div>
            </>
          )}
        </div>
      </>,
      document.body
    );
  };

  return (
    <>
      <div className="worker-table-container">
        <table className="worker-table">
          <thead>
            <tr>
              <th>שם</th>
              <th>שעות</th>
              <th>%</th>
              <th>סכום</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => {
              const amount = worker.hours * worker.percentage * tipPerHour;
              return (
                <tr 
                  key={worker.id}
                  onClick={(e) => openBottomSheet(worker, e)}
                  className="worker-row"
                >
                  <td className="worker-name-cell">
                    {worker.name}
                  </td>
                  <td className="hours-cell">{worker.hours}</td>
                  <td className="percentage-cell">
                    <span className={`percentage-badge ${worker.percentage === 1 ? 'full' : 'partial'}`}>
                      {worker.percentage === 0.7 ? '70%' : '100%'}
                    </span>
                  </td>
                  <td className="amount-cell">{formatCurrency(amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Summary Cards */}
      <div className="table-summary">
        <div className="summary-card">
          <span className="summary-label">סה"כ עובדים</span>
          <span className="summary-value">{workers.length}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">100%: {totals.workers100}</span>
          <span className="summary-label">70%: {totals.workers70}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">סה"כ שעות</span>
          <span className="summary-value">{totals.hours.toFixed(2)}</span>
        </div>
        <div className="summary-card highlight">
          <span className="summary-label">סה"כ לחלוקה</span>
          <span className="summary-value">{formatCurrency(totals.amount)}</span>
        </div>
      </div>

      {/* Bottom Sheet Portal */}
      {renderBottomSheet()}
    </>
  );
};