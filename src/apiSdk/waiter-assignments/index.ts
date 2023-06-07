import axios from 'axios';
import queryString from 'query-string';
import { WaiterAssignmentInterface } from 'interfaces/waiter-assignment';
import { GetQueryInterface } from '../../interfaces';

export const getWaiterAssignments = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/waiter-assignments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createWaiterAssignment = async (waiterAssignment: WaiterAssignmentInterface) => {
  const response = await axios.post('/api/waiter-assignments', waiterAssignment);
  return response.data;
};

export const updateWaiterAssignmentById = async (id: string, waiterAssignment: WaiterAssignmentInterface) => {
  const response = await axios.put(`/api/waiter-assignments/${id}`, waiterAssignment);
  return response.data;
};

export const getWaiterAssignmentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/waiter-assignments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteWaiterAssignmentById = async (id: string) => {
  const response = await axios.delete(`/api/waiter-assignments/${id}`);
  return response.data;
};
