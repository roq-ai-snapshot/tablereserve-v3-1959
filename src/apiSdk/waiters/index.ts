import axios from 'axios';
import queryString from 'query-string';
import { WaiterInterface } from 'interfaces/waiter';
import { GetQueryInterface } from '../../interfaces';

export const getWaiters = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/waiters${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createWaiter = async (waiter: WaiterInterface) => {
  const response = await axios.post('/api/waiters', waiter);
  return response.data;
};

export const updateWaiterById = async (id: string, waiter: WaiterInterface) => {
  const response = await axios.put(`/api/waiters/${id}`, waiter);
  return response.data;
};

export const getWaiterById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/waiters/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteWaiterById = async (id: string) => {
  const response = await axios.delete(`/api/waiters/${id}`);
  return response.data;
};
