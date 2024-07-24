import React from 'react';
import { useParams } from 'react-router-dom';
import SuperAdminDashboard from './component/Dashboard/SuperAdminDashboard';
import AdminDashboard from './component/Dashboard/AdminDashboard';
import DepartmentDashboard from './component/Dashboard/DepartmentDashboard';

const Dashboard = () => {
  const { userType } = useParams();

  if (!userType) {
      return <div>Invalid User Type</div>;
  }

  switch (userType) {
      case 'admin':
          return <AdminDashboard />;
      case 'superadmin':
          return <SuperAdminDashboard />;
      case 'department':
          return <DepartmentDashboard />;
      default:
          return <div>Invalid User Type</div>;
  }
};

export default Dashboard;
