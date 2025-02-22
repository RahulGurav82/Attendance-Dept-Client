import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { endpoints } from '../config/api';

const DepartmentList = ({ departments }) => {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [loginData, setLoginData] = useState({
        dept_email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDepartmentClick = (dept) => {
        setSelectedDept(dept);
        setLoginData({ dept_email: '', password: '' });
        setShowLoginForm(true);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(endpoints.department.login, loginData);
            if (response.data.success) {
                localStorage.setItem('deptToken', response.data.token);
                navigate('/department-dashboard');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => (
                    <div
                        key={dept.dept_id}
                        onClick={() => handleDepartmentClick(dept)}
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <h3 className="text-xl font-semibold mb-2">{dept.dept_name}</h3>
                        <p className="text-gray-600 mb-2">Department ID: {dept.dept_id}</p>
                        <p className="text-gray-600">HOD: {dept.hod_name}</p>
                    </div>
                ))}
            </div>

            {showLoginForm && selectedDept && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">
                            Login to {selectedDept.dept_name}
                        </h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form onSubmit={handleLoginSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Department Email
                                </label>
                                <input
                                    type="email"
                                    value={loginData.dept_email}
                                    onChange={(e) =>
                                        setLoginData({ ...loginData, dept_email: e.target.value })
                                    }
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={loginData.password}
                                    onChange={(e) =>
                                        setLoginData({ ...loginData, password: e.target.value })
                                    }
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowLoginForm(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentList;
