import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Authentication
export const login = (credentials) => api.post('/auth/login', credentials);
export const logout = () => api.post('/auth/logout');
export const checkAuth = () => api.get('/auth/check');

// Departments
export const getDepartments = () => api.get('/departments');
export const createDepartment = (data) => api.post('/departments', data);

// Employees
export const getEmployees = () => api.get('/employees');
export const createEmployee = (data) => api.post('/employees', data);

// Salaries
export const getSalaries = () => api.get('/salaries');
export const createSalary = (data) => api.post('/salaries', data);
export const updateSalary = (id, data) => api.put(`/salaries/${id}`, data);
export const deleteSalary = (id) => api.delete(`/salaries/${id}`);

// Reports
export const getMonthlyPayroll = (month) =>
    api.get('/reports/monthly-payroll', { params: { month } });

export default api;
