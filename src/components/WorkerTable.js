import React, { useState, useRef, useEffect } from 'react';

export const WorkerTable = ({ 
  workers, 
  tipPerHour, 
  formatCurrency, 
  onEdit, 
  onDelete 
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const toggleDropdown = (workerId, event) => {
    if (activeDropdown === workerId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(workerId);
      
      // Calculate position for mobile
      if (window.innerWidth <= 768) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + rect.width / 2
        });
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          !event.target.closest('.worker-name')) {
        setActiveDropdown(null);
      }
    };

    const handleScroll = () => {
      // Close dropdown on scroll for better mobile experience
      if (activeDropdown !== null) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeDropdown]);

  return (
    <>
      {/* Backdrop for mobile */}
      {activeDropdown !== null && window.innerWidth <= 768 && (
        <div 
          className="dropdown-backdrop" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
      
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
                        toggleDropdown(worker.id, e);
                      }}
                      aria-label={`Options for ${worker.name}`}
                      aria-expanded={activeDropdown === worker.id}
                      aria-haspopup="true"
                    >
                      {worker.name}
                    </button>
                    {activeDropdown === worker.id && (
                      <div 
                        ref={dropdownRef}
                        className="dropdown-menu"
                        style={window.innerWidth <= 768 ? {
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`
                        } : {}}
                        role="menu"
                      >
                        <button 
                          onClick={() => {
                            onEdit(worker);
                            setActiveDropdown(null);
                          }}
                          className="dropdown-item"
                          role="menuitem"
                        >
                          <span>✏️ Edit</span>
                        </button>
                        <button 
                          onClick={() => {
                            onDelete(worker.id);
                            setActiveDropdown(null);
                          }}
                          className="dropdown-item delete"
                          role="menuitem"
                        >
                          <span>🗑️ Delete</span>
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
    </>
  );
};