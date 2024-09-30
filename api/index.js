import {BASE_URL} from '@env';
import axios from 'axios';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
});

export const apiCall = {
  get: async (url, headerProps = {}) => {
    return instance
      .get(url, {
        headerProps,
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  },

  post: async (url, data, headerProps = {}) => {
    return instance
      .post(url, data, {
        headers: headerProps,
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  },
};
