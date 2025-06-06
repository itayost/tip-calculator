// src/constants/config.js

export const APP_CONFIG = {
  // App info
  APP_NAME: 'מחשבון טיפים',
  VERSION: '1.0.0',
  
  // Storage keys
  STORAGE_KEY: 'tipCalculatorData',
  
  // Worker percentages
  PERCENTAGE_FULL: 1.0,
  PERCENTAGE_PARTIAL: 0.7,
  
  // Validation limits
  MIN_NAME_LENGTH: 2,
  MAX_HOURS: 24,
  MIN_HOURS: 0,
  MAX_TIP_AMOUNT: 100000,
  WARNING_TIP_AMOUNT: 10000,
  
  // UI settings
  VIBRATION_DURATION: 30,
  VIBRATION_DELETE: [50, 50, 50],
  ANIMATION_DURATION: 300,
  
  // Formatting
  CURRENCY: 'ILS',
  LOCALE: 'he-IL',
  
  // Worker types
  WORKER_TYPES: {
    FULL: { value: 1.0, label: 'מלצר', percentage: '100%' },
    PARTIAL: { value: 0.7, label: 'עוזר', percentage: '70%' }
  },
  
  // Shift types
  SHIFT_TYPES: ['צהריים', 'ערב'],
  
  // Default values
  DEFAULT_SHIFT: 'ערב',
  DEFAULT_PERCENTAGE: 1.0
};

// src/constants/messages.js

export const MESSAGES = {
  // Validation messages
  VALIDATION: {
    NAME_REQUIRED: 'נא להזין שם',
    NAME_TOO_SHORT: 'שם חייב להכיל לפחות 2 תווים',
    NAME_EXISTS: 'עובד עם שם זה כבר קיים',
    HOURS_REQUIRED: 'נא להזין שעות',
    HOURS_INVALID: 'נא להזין מספר תקין',
    HOURS_TOO_LOW: 'שעות חייבות להיות גדולות מ-0',
    HOURS_TOO_HIGH: 'שעות לא יכולות לעלות על 24',
    TIPS_REQUIRED: 'נא להזין סכום טיפים',
    TIPS_INVALID: 'נא להזין מספר תקין',
    TIPS_NEGATIVE: 'טיפים לא יכולים להיות שליליים',
    TIPS_ZERO: 'סכום הטיפים לא יכול להיות אפס',
    TIPS_TOO_HIGH: 'הסכום נראה גבוה מדי',
    PERCENTAGE_INVALID: 'אחוז לא תקין'
  },
  
  // Warning messages
  WARNINGS: {
    HIGH_TIP_AMOUNT: 'הסכום נראה גבוה. אנא ודא שהסכום נכון.',
    DISCREPANCY: 'הפרש'
  },
  
  // Confirmation messages
  CONFIRMATIONS: {
    DELETE_WORKER: (name, amount) => 
      `האם אתה בטוח שברצונך למחוק את ${name}?\nהעובד אמור לקבל ${amount} בטיפים.`,
    RESET_ALL: (count) => 
      count > 0 
        ? `האם אתה בטוח שברצונך לאפס את כל הנתונים?\nפעולה זו תמחק ${count} עובדים ולא ניתן לבטלה.`
        : 'האם אתה בטוח שברצונך לאפס את כל הנתונים?'
  },
  
  // Labels
  LABELS: {
    WORKER_NAME: 'שם העובד',
    WORK_HOURS: 'שעות עבודה',
    TIP_PERCENTAGE: 'אחוז טיפ',
    TOTAL_TIPS: 'סכום טיפים לחלוקה',
    ADD_WORKER: 'הוספת עובד',
    EDIT_WORKER: 'עריכת עובד',
    UPDATE_WORKER: 'עדכן עובד',
    ADD_WORKER_BTN: 'הוסף עובד',
    CANCEL: 'ביטול',
    EDIT: 'ערוך',
    DELETE: 'מחק',
    RESET_ALL: 'אפס הכל',
    EXPORT_PDF: 'ייצוא PDF',
    PRINT: 'צור PDF',
    TOTAL_HOURS: 'סה"כ שעות',
    TIP_PER_HOUR_100: 'טיפ לשעה 100%',
    TIP_PER_HOUR_70: 'טיפ לשעה 70%',
    TOTAL_DISTRIBUTED: 'סה"כ חולק',
    TOTAL_WORKERS: 'סה"כ עובדים',
    RESTAURANT_NAME: 'שם המסעדה',
    SHIFT_DATE: 'תאריך',
    SHIFT_TYPE: 'משמרת',
    MANAGER_NAME: 'שם המנהל'
  },
  
  // Helper text
  HELPER_TEXT: {
    HOURS_INPUT: 'ניתן להזין רבעי שעה (0.25, 0.5, 0.75)',
    WORKER_NAME_PLACEHOLDER: 'הכנס שם',
    HOURS_PLACEHOLDER: '0',
    TIPS_PLACEHOLDER: '0',
    RESTAURANT_PLACEHOLDER: 'הכנס שם מסעדה',
    MANAGER_PLACEHOLDER: 'הכנס שם מנהל'
  },
  
  // Accessibility
  ACCESSIBILITY: {
    CLEAR_AMOUNT: 'נקה סכום',
    TIPS_AMOUNT: 'סכום טיפים',
    CLOSE_MODAL: 'סגור חלון'
  }
};

// src/constants/index.js
export * from './config';
export * from './messages';