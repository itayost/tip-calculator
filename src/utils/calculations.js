export const calculateTipPerHour = (workers, totalTips) => {
  const totalEffectiveHours = workers.reduce(
    (sum, worker) => sum + worker.hours * worker.percentage,
    0
  );
  
  return totalEffectiveHours > 0 
    ? (parseFloat(totalTips) || 0) / totalEffectiveHours 
    : 0;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS'
  }).format(amount);
};