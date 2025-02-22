import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentForm from './DepartmentForm';
import DepartmentList from './DepartmentList';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch dashboard data
        const dashboardResponse = await fetch('http://localhost:5000/api/auth/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!dashboardResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const dashData = await dashboardResponse.json();
        setDashboardData(dashData);

        // Fetch departments
        const departmentsResponse = await fetch('http://localhost:5000/api/department/all');
        if (!departmentsResponse.ok) {
          throw new Error('Failed to fetch departments');
        }

        const deptData = await departmentsResponse.json();
        setDepartments(deptData.departments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDepartmentCreated = (newDepartment) => {
    setDepartments([...departments, newDepartment]);
    setShowDepartmentForm(false);
  };

  if (loading) {
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
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
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

        {/* Welcome Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome, {dashboardData?.user?.name}
          </h2>
          <p className="text-gray-600">
            Email: {dashboardData?.user?.email}
          </p>
        </div>

        {/* Department Management Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Departments</h2>
            <button
              onClick={() => setShowDepartmentForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Create Department
            </button>
          </div>
          
          <DepartmentList departments={departments} />
        </div>
      </main>

      {/* Department Creation Modal */}
      {showDepartmentForm && (
        <DepartmentForm
          onDepartmentCreated={handleDepartmentCreated}
          onClose={() => setShowDepartmentForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
