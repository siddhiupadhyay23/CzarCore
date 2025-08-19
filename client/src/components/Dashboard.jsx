import React, { useEffect, useState } from 'react';
import EmployeeDashboard from './EmployeeDashboard';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    console.log('Dashboard loading, userData:', userData);
    
    if (!userData) {
      console.log('No user data found, redirecting to auth');
      window.location.href = '/auth';
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log('Parsed user:', parsedUser);
      
      if (parsedUser.role === 'admin') {
        console.log('Admin user, redirecting to admin panel');
        window.location.href = '/admin';
        return;
      }
      
      setUser(parsedUser);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl text-red-600">Access Denied</p>
          <p className="text-gray-600 mt-2">Please log in to continue</p>
        </div>
      </div>
    );
  }

  return <EmployeeDashboard />;
}

export default Dashboard;