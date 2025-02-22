const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const endpoints = {
    auth: {
        login: `${API_URL}/api/auth/login`,
        dashboard: `${API_URL}/api/auth/dashboard`,
    },
    department: {
        create: `${API_URL}/api/department/create`,
        login: `${API_URL}/api/department/login`,
        profile: `${API_URL}/api/department/profile`,
        all: `${API_URL}/api/department/all`,
    },
    students: {
        add: `${API_URL}/api/students/add`,
        all: `${API_URL}/api/students/all`,
    }
};

export default API_URL;
