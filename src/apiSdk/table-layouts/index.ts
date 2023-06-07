import axios from 'axios';
import queryString from 'query-string';
import { TableLayoutInterface } from 'interfaces/table-layout';
import { GetQueryInterface } from '../../interfaces';

export const getTableLayouts = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/table-layouts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTableLayout = async (tableLayout: TableLayoutInterface) => {
  const response = await axios.post('/api/table-layouts', tableLayout);
  return response.data;
};

export const updateTableLayoutById = async (id: string, tableLayout: TableLayoutInterface) => {
  const response = await axios.put(`/api/table-layouts/${id}`, tableLayout);
  return response.data;
};

export const getTableLayoutById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/table-layouts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTableLayoutById = async (id: string) => {
  const response = await axios.delete(`/api/table-layouts/${id}`);
  return response.data;
};
