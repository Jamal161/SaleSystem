import api from './api';

export const getCurrentStockReport = () => {
  return api.get('/reports/current-stock');
};

export const getDateWiseStockReport = (fromDate, toDate) => {
  return api.get('/reports/date-wise-stock', {
    params: {
      fromDate,
      toDate,
    },
  });
};