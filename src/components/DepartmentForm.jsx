import React, { useState } from 'react';
import axios from 'axios';

const DepartmentForm = ({ onDepartmentCreated, onClose }) => {
    const [formData, setFormData] = useState({
        dept_name: '',
        hod_name: '',
        dept_email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/department/create', formData);
            if (response.data.success) {
                onDepartmentCreated(response.data.department);
                onClose();
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating department');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Create New Department</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Department Name
                        </label>
                        <input
                            type="text"
                            name="dept_name"
                            value={formData.dept_name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            HOD Name
                        </label>
                        <input
                            type="text"
                            name="hod_name"
                            value={formData.hod_name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Department Email
                        </label>
                        <input
                            type="email"
                            name="dept_email"
                            value={formData.dept_email}
                            onChange={handleChange}
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
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Create Department
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartmentForm;
