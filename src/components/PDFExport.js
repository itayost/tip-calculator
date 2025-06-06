import React, { useState, useCallback } from 'react';

export const PDFExport = ({ workers, totalTips, tipPerHour }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [shiftType, setShiftType] = useState('ערב');
  const [managerName, setManagerName] = useState('');
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
  };

  // Calculate totals
  const totals = workers.reduce((acc, worker) => {
    const amount = worker.hours * worker.percentage * tipPerHour;
    return {
      hours: acc.hours + worker.hours,
      effectiveHours: acc.effectiveHours + (worker.hours * worker.percentage),
      amount: acc.amount + amount,
      workers100: acc.workers100 + (worker.percentage === 1 ? 1 : 0),
      workers70: acc.workers70 + (worker.percentage === 0.7 ? 1 : 0)
    };
  }, { hours: 0, effectiveHours: 0, amount: 0, workers100: 0, workers70: 0 });

  // Generate PDF
  const generatePDF = useCallback(() => {
    // Create a print-specific container
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="he" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>דוח חלוקת טיפים - ${restaurantName || 'מסעדה'}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            direction: rtl;
            color: #333;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #ddd;
          }
          
          h1 {
            font-size: 24px;
            margin-bottom: 10px;
          }
          
          .info-grid {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            gap: 20px;
          }
          
          .info-item {
            flex: 1;
            text-align: center;
          }
          
          .info-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          
          .info-value {
            font-size: 16px;
            font-weight: bold;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          th, td {
            padding: 12px;
            text-align: right;
            border: 1px solid #ddd;
          }
          
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          
          .amount-cell {
            font-weight: bold;
            color: #2563eb;
          }
          
          .totals-row {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          
          .summary {
            margin-bottom: 30px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          
          .summary-item {
            display: flex;
            justify-content: space-between;
          }
          
          .signatures {
            margin-top: 50px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
          
          .signature-box {
            text-align: center;
            padding-top: 60px;
            border-top: 1px solid #333;
          }
          
          .signature-label {
            font-size: 14px;
            margin-top: 5px;
          }
          
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          
          @media print {
            body {
              padding: 10px;
            }
            
            .signatures {
              position: fixed;
              bottom: 50px;
              left: 20px;
              right: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>דוח חלוקת טיפים</h1>
          <h2>${restaurantName || 'שם המסעדה'}</h2>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">תאריך</div>
            <div class="info-value">${new Date(shiftDate).toLocaleDateString('he-IL')}</div>
          </div>
          <div class="info-item">
            <div class="info-label">משמרת</div>
            <div class="info-value">${shiftType}</div>
          </div>
          <div class="info-item">
            <div class="info-label">סה"כ טיפים</div>
            <div class="info-value">${formatCurrency(totalTips)}</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>שם</th>
              <th>שעות</th>
              <th>אחוז</th>
              <th>סכום</th>
            </tr>
          </thead>
          <tbody>
            ${workers.map(worker => {
              const amount = worker.hours * worker.percentage * tipPerHour;
              return `
                <tr>
                  <td>${worker.name}</td>
                  <td>${worker.hours}</td>
                  <td>${worker.percentage === 1 ? '100%' : '70%'}</td>
                  <td class="amount-cell">${formatCurrency(amount)}</td>
                </tr>
              `;
            }).join('')}
            <tr class="totals-row">
              <td>סה"כ</td>
              <td>${totals.hours.toFixed(2)}</td>
              <td>-</td>
              <td class="amount-cell">${formatCurrency(totals.amount)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="summary">
          <h3>סיכום</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <span>מספר עובדים:</span>
              <strong>${workers.length}</strong>
            </div>
            <div class="summary-item">
              <span>עובדים 100%:</span>
              <strong>${totals.workers100}</strong>
            </div>
            <div class="summary-item">
              <span>עובדים 70%:</span>
              <strong>${totals.workers70}</strong>
            </div>
            <div class="summary-item">
              <span>שעות אפקטיביות:</span>
              <strong>${totals.effectiveHours.toFixed(2)}</strong>
            </div>
            <div class="summary-item">
              <span>טיפ לשעה 100%:</span>
              <strong>${formatCurrency(tipPerHour)}</strong>
            </div>
            <div class="summary-item">
              <span>טיפ לשעה 70%:</span>
              <strong>${formatCurrency(tipPerHour * 0.7)}</strong>
            </div>
          </div>
        </div>
        
        <div class="signatures">
          <div class="signature-box">
            <div class="signature-label">חתימת מנהל: ${managerName || '_____________'}</div>
          </div>
          <div class="signature-box">
            <div class="signature-label">תאריך: ${new Date().toLocaleDateString('he-IL')}</div>
          </div>
        </div>
        
        <div class="footer">
          נוצר על ידי מערכת חלוקת טיפים | ${new Date().toLocaleString('he-IL')}
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      
      // Close modal after print dialog opens
      setShowExportModal(false);
    };
  }, [workers, totalTips, tipPerHour, restaurantName, shiftDate, shiftType, managerName, totals]);

  // Open export modal
  const openExportModal = useCallback(() => {
    setShowExportModal(true);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  }, []);

  return (
    <>
      {/* Export Button */}
      <button 
        onClick={openExportModal}
        className="export-pdf-btn"
      >
        <span className="btn-icon">📄</span>
        <span>ייצוא PDF</span>
      </button>

      {/* Export Modal */}
      {showExportModal && (
        <>
          <div 
            className="modal-backdrop"
            onClick={() => setShowExportModal(false)}
          />
          <div className="export-modal">
            <div className="modal-header">
              <h2>פרטים לדוח PDF</h2>
              <button 
                className="close-modal"
                onClick={() => setShowExportModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-field">
                <label htmlFor="restaurantName">שם המסעדה</label>
                <input
                  id="restaurantName"
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="הכנס שם מסעדה"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="shiftDate">תאריך</label>
                <input
                  id="shiftDate"
                  type="date"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                />
              </div>
              
              <div className="form-field">
                <label>משמרת</label>
                <div className="shift-toggle">
                  <button
                    type="button"
                    className={`toggle-option ${shiftType === 'צהריים' ? 'active' : ''}`}
                    onClick={() => setShiftType('צהריים')}
                  >
                    צהריים
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${shiftType === 'ערב' ? 'active' : ''}`}
                    onClick={() => setShiftType('ערב')}
                  >
                    ערב
                  </button>
                </div>
              </div>
              
              <div className="form-field">
                <label htmlFor="managerName">שם המנהל</label>
                <input
                  id="managerName"
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="הכנס שם מנהל"
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  onClick={generatePDF}
                  className="generate-pdf-btn"
                >
                  <span className="btn-icon">🖨️</span>
                  <span>צור PDF</span>
                </button>
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="cancel-btn"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};