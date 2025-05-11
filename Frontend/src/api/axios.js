// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',   // pointe vers /api
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // on injecte directement le token Bearer si présent
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
  },

});

// (Optionnel) Intercepteur global d'erreurs 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // ex. redirection vers /login ou affichage d'un message
      console.error('Non authentifié');
    }
    return Promise.reject(error);
  }
);

export default api;
