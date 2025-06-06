// src/utils/validators.js

// Worker validation
export const validateWorkerInput = (workerData, existingWorkers, editingId = null) => {
  const errors = {};
  const { name, hours, percentage } = workerData;

  // Validate name
  if (!name || !name.trim()) {
    errors.name = 'נא להזין שם';
  } else if (name.trim().length < 2) {
    errors.name = 'שם חייב להכיל לפחות 2 תווים';
  } else if (!editingId && existingWorkers.some(w => 
    w.name.toLowerCase() === name.trim().toLowerCase()
  )) {
    errors.name = 'עובד עם שם זה כבר קיים';
  }

  // Validate hours
  const hoursNum = parseFloat(hours);
  if (!hours || hours === '') {
    errors.hours = 'נא להזין שעות';
  } else if (isNaN(hoursNum)) {
    errors.hours = 'נא להזין מספר תקין';
  } else if (hoursNum <= 0) {
    errors.hours = 'שעות חייבות להיות גדולות מ-0';
  } else if (hoursNum > 24) {
    errors.hours = 'שעות לא יכולות לעלות על 24';
  }

  // Validate percentage (should be either 0.7 or 1.0)
  if (percentage !== 0.7 && percentage !== 1.0) {
    errors.percentage = 'אחוז לא תקין';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Tip amount validation
export const validateTipAmount = (amount) => {
  const errors = {};
  const numValue = parseFloat(amount);

  if (amount === '' || amount === undefined || amount === null) {
    errors.totalTips = 'נא להזין סכום טיפים';
  } else if (isNaN(numValue)) {
    errors.totalTips = 'נא להזין מספר תקין';
  } else if (numValue < 0) {
    errors.totalTips = 'טיפים לא יכולים להיות שליליים';
  } else if (numValue === 0) {
    errors.totalTips = 'סכום הטיפים לא יכול להיות אפס';
  } else if (numValue > 100000) {
    errors.totalTips = 'הסכום נראה גבוה מדי';
  }

  const warning = numValue > 10000 && numValue <= 100000;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warning
  };
};

// Field-specific validation
export const validateField = (field, value) => {
  switch (field) {
    case 'name':
      if (!value.trim()) {
        return 'נא להזין שם';
      }
      if (value.trim().length < 2) {
        return 'שם חייב להכיל לפחות 2 תווים';
      }
      return null;

    case 'hours':
      const numHours = parseFloat(value);
      if (value === '' || isNaN(numHours)) {
        return 'נא להזין שעות';
      }
      if (numHours <= 0) {
        return 'שעות חייבות להיות גדולות מ-0';
      }
      if (numHours > 24) {
        return 'שעות לא יכולות לעלות על 24';
      }
      return null;

    case 'totalTips':
      const numTips = parseFloat(value);
      if (value === '' || isNaN(numTips)) {
        return 'נא להזין סכום טיפים';
      }
      if (numTips < 0) {
        return 'טיפים לא יכולים להיות שליליים';
      }
      if (numTips === 0) {
        return 'סכום הטיפים לא יכול להיות אפס';
      }
      return null;

    default:
      return null;
  }
};