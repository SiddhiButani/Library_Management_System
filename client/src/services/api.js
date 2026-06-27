import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (data) => API.post('/auth/forgot-password', data),
  resetPassword: (token, data) => API.post(`/auth/reset-password/${token}`, data)
};

// User APIs
export const userAPI = {
  getUsers: (params) => API.get('/users', { params }),
  getUserById: (id) => API.get(`/users/${id}`),
  updateProfile: (data) => {
    const config = data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return API.put('/users/profile', data, config);
  },
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  deleteUser: (id) => API.delete(`/users/${id}`),
  getUserStats: () => API.get('/users/stats'),
  changePassword: (data) => API.put('/users/change-password', data),
  upgradeMembership: (data) => API.put('/users/membership', data)
};

// Book APIs
export const bookAPI = {
  getBooks: (params) => API.get('/books', { params }),
  getBook: (id) => API.get(`/books/${id}`),
  addBook: (data) => {
    const config = data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return API.post('/books', data, config);
  },
  updateBook: (id, data) => {
    const config = data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return API.put(`/books/${id}`, data, config);
  },
  deleteBook: (id) => API.delete(`/books/${id}`),
  checkAvailability: (id) => API.get(`/books/availability/${id}`),
  getBookStats: () => API.get('/books/stats'),
  getCategories: () => API.get('/books/categories'),
  addCategory: (data) => API.post('/books/categories', data),
  updateCategory: (id, data) => API.put(`/books/categories/${id}`, data),
  deleteCategory: (id) => API.delete(`/books/categories/${id}`)
};

// Borrow APIs
export const borrowAPI = {
  requestBook: (data) => API.post('/borrows/request', data),
  getMyBorrows: (params) => API.get('/borrows/my-borrows', { params }),
  getAllBorrows: (params) => API.get('/borrows', { params }),
  issueBook: (id) => API.put(`/borrows/issue/${id}`),
  returnBook: (id) => API.put(`/borrows/return/${id}`),
  renewBook: (id) => API.put(`/borrows/renew/${id}`),
  rejectRequest: (id, data) => API.put(`/borrows/reject/${id}`, data),
  getOverdueBooks: () => API.get('/borrows/overdue'),
  getPendingRequests: () => API.get('/borrows/pending'),
  getBorrowStats: () => API.get('/borrows/stats')
};

// Fine APIs
export const fineAPI = {
  getMyFines: () => API.get('/fines/my-fines'),
  payFine: (id, data) => API.post(`/fines/pay/${id}`, data),
  getAllFines: (params) => API.get('/fines', { params }),
  waiveFine: (id, data) => API.put(`/fines/waive/${id}`, data),
  getFineStats: () => API.get('/fines/stats')
};

// Waitlist APIs
export const waitlistAPI = {
  joinWaitlist: (bookId) => API.post(`/waitlist/join/${bookId}`),
  leaveWaitlist: (bookId) => API.delete(`/waitlist/leave/${bookId}`),
  getMyWaitlist: () => API.get('/waitlist/my-list'),
  getAllWaitlists: () => API.get('/waitlist')
};

// Contact APIs
export const contactAPI = {
  submitMessage: (data) => API.post('/contact', data),
  getMessages: (params) => API.get('/contact', { params }),
  replyMessage: (id, data) => API.put(`/contact/${id}/reply`, data),
  markAsRead: (id) => API.put(`/contact/${id}/read`)
};

// Report APIs
export const reportAPI = {
  getDashboardStats: () => API.get('/reports/dashboard'),
  getMemberDashboard: () => API.get('/reports/member-dashboard')
};

// Settings APIs
export const settingsAPI = {
  getSettings: () => API.get('/settings'),
  updateSettings: (data) => API.put('/settings', data)
};

// Notification APIs
export const notificationAPI = {
  getNotifications: () => API.get('/notifications'),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put('/notifications/read-all')
};

export default API;
