import { message } from 'antd';

class Http {
  static post = async (url, data) => {
    return await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: localStorage.getItem('access_token'),
        fridge: localStorage.getItem('fridge'),
      }),
    })
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
        if (response.status === 'error') {
          response?.message &&
            message.open({ type: 'error', content: response.message });
          return null;
        } else {
          response?.message &&
            message.open({ type: 'success', content: response.message });
        }
        return response.metadata;
      });
  };
  static upload = async (url, data) => {
    return await fetch(url, {
      method: 'POST',
      body: data,
      headers: new Headers({
        Authorization: localStorage.getItem('access_token'),
        fridge: localStorage.getItem('fridge'),
      }),
    })
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
        if (response.status === 'error') {
          response?.message &&
            message.open({ type: 'error', content: response.message });
          return null;
        } else {
          response?.message &&
            message.open({ type: 'success', content: response.message });
        }
        return response.metadata;
      });
  };

  static get = async url => {
    return await fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    })
      .then(response => response.json())
      .then(response => response.data);
  };

  static delete = async url => {
    return await fetch(url, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: localStorage.getItem('access_token'),
        fridge: localStorage.getItem('fridge'),
      }),
    })
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
        if (response.status === 'error') {
          response?.message &&
            message.open({ type: 'error', content: response.message });
          return null;
        } else {
          response?.message &&
            message.open({ type: 'success', content: response.message });
        }
        return response.metadata;
      });
  };
}

export default Http;

export const BASE_URL = 'http://localhost:8000';