import api from './api';

export const login = (username, password) => {
  return api.post('/Auth/login', { username, password }).then(res => res.data);
};

export const register = (username, password) => {
  return api.post('/Auth/register', { username, password }).then(res => res.data);
};