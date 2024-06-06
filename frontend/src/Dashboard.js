import React from 'react';
import { useParams } from 'react-router-dom';
// import ComplaintForm from './component/ComplaintForm';
import SuperAdminDashboard from './component/Dashboard/SuperAdminDashboard';
import AdminDashboard from './component/Dashboard/AdminDashboard';
import DepartmentDashboard from './component/Dashboard/DepartmentDashboard';

const Dashboard = () => {
  const { userType } = useParams();

  switch (userType) {
    case 'superadmin':
      return <SuperAdminDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'department':
      return <DepartmentDashboard />;
    default:
      return <div>Invalid User Type</div>;
  }
};

export default Dashboard;
