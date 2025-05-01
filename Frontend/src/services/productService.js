import api from './api';

export const getProducts = (page = 1, pageSize = 10, search = '') => {
  return api.get('/products', {
    params: {
      page,
      pageSize,
      search,
    },
  });
};

export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

export const createProduct = (product) => {
  return api.post('/products', product);
};

export const updateProduct = (id, product) => {
  return api.put(`/products/${id}`, product);
};

export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};