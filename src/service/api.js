import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) req.headers.Authorization = `Bearer ${user.token}`;
  return req;
});

// Auth
export const loginUser    = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getProfile   = ()     => API.get('/auth/profile');

// Jobs
export const getJobs      = (params) => API.get('/jobs', { params });
export const getJobById   = (id)     => API.get(`/jobs/${id}`);
export const applyToJob   = (id)     => API.post(`/jobs/${id}/apply`);
export const saveJob      = (id)     => API.post(`/jobs/${id}/save`);

// Companies
export const getCompanies   = ()   => API.get('/company');
export const getCompanyById = (id) => API.get(`/company/${id}`);