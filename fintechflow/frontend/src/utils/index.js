// Format PKR currency
export const formatPKR = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// API base URL - uses env var for production, localhost for dev
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Format date
export const formatDate = (isoString) => {
  return new Date(isoString).toLocaleString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
