
import api from './api';

export const getSales = (page = 1, pageSize = 10) => {
  return api.get('/sales', {
    params: {  
      page,
      pageSize
    }
  });
};


export const createSale = (saleData) => {
    return api.post('/sales', saleData, {
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [(data) => {
        return JSON.stringify({
          productId: data.productId,
          quantitySold: data.quantitySold
        });
      }]
    });
  };

