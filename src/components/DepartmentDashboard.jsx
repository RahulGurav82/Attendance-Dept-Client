import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BiometricCapture from './BiometricCapture';
import { endpoints } from '../config/api';

const DepartmentDashboard = () => {
    const [department, setDepartment] = useState(null);
    const [students, setStudents] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        roll_no: '',
        email: '',
        class: '',
        fingerprint1: '',
        fingerprint2: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('deptToken');
        if (!token) {
            navigate('/');
            return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        fetchDepartmentData();
        fetchStudents();
    }, [navigate]);

    const fetchDepartmentData = async () => {
        try {
            const response = await axios.get(endpoints.department.profile);
            if (response.data.success) {
                setDepartment(response.data.department);
            }
        } catch (error) {
            console.error('Failed to fetch department data:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('deptToken');
                navigate('/');
            }
            setError('Failed to fetch department data');
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get(endpoints.students.all);
            setStudents(response.data.students);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            setError('Failed to fetch students');
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFingerprintCapture = (fingerprintData, fingerprintNumber) => {
        setFormData(prev => ({
            ...prev,
            [`fingerprint${fingerprintNumber}`]: fingerprintData
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(endpoints.students.add, formData);

            if (response.data.success) {
                setStudents([...students, response.data.student]);
                setShowAddForm(false);
                setFormData({
                    name: '',
                    roll_no: '',
                    email: '',
                    class: '',
                    fingerprint1: '',
                    fingerprint2: ''
                });
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add student');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('deptToken');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/');
    };

    if (!department) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-xl font-bold text-gray-800">
                                    {department.dept_name}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    ID: {department.dept_id}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-900"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Students</h2>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Add Student
                        </button>
                    </div>

                    {showAddForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-8 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
                                <h3 className="text-lg font-semibold mb-4">Add New Student</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Roll Number
                                        </label>
                                        <input
                                            type="text"
                                            name="roll_no"
                                            value={formData.roll_no}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Class
                                        </label>
                                        <input
                                            type="text"
                                            name="class"
                                            value={formData.class}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded"
                                            required
                                            placeholder="e.g., CSE-A"
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Fingerprints
                                        </label>
                                        <div className="space-y-4">
                                            <BiometricCapture 
                                                onCapture={(data) => handleFingerprintCapture(data, 1)}
                                                fingerprintNumber={1}
                                            />
                                            <BiometricCapture 
                                                onCapture={(data) => handleFingerprintCapture(data, 2)}
                                                fingerprintNumber={2}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                            disabled={!formData.fingerprint1 || !formData.fingerprint2}
                                        >
                                            Add Student
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Roll No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Class
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department ID
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <tr key={student.roll_no}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.roll_no}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.class}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.dept_id}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DepartmentDashboard;
