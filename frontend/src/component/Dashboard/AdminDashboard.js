import React, { useState, useEffect } from 'react';
import AdminTable from '../AdminTable';
import DashHeader from '../DashHeader';
import axios from 'axios';
import io from 'socket.io-client';
import './AdminDashboard.css';

const socket = io('http://localhost:5000', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const workers = ['Worker1', 'Worker2', 'Worker3']; // Example workers

  useEffect(() => {
    fetchComplaints();
    socket.on('complaintCreated', (newComplaint) => {
      setComplaints((prevComplaints) => [...prevComplaints, newComplaint]);
    });

    socket.on('complaintUpdated', (updatedComplaint) => {
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === updatedComplaint._id ? updatedComplaint : complaint
        )
      );
    });

    return () => {
      socket.off('complaintCreated');
      socket.off('complaintUpdated');
    };
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints/admin', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setComplaints(res.data);
    } catch (error) {
      console.error('There was an error fetching the complaints!', error);
    }
  };

  const assignWorker = async (index, worker) => {
    try {
      const updatedComplaint = { ...complaints[index], assignedWorker: worker };
      await axios.put(`http://localhost:5000/api/complaints/${complaints[index]._id}`, updatedComplaint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint, i) =>
          i === index ? updatedComplaint : complaint
        )
      );
    } catch (error) {
      console.error('There was an error updating the complaint!', error);
    }
  };

  const updateStatus = async (index, status) => {
    try {
      const updatedComplaint = { ...complaints[index], status };
      await axios.put(`http://localhost:5000/api/complaints/${complaints[index]._id}`, updatedComplaint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint, i) =>
          i === index ? updatedComplaint : complaint
        )
      );
    } catch (error) {
      console.error('There was an error updating the complaint!', error);
    }
  };

  return (
    <div>
      <DashHeader />
      <div className="dashboard-container">
        <h1>All Complaints</h1>
        <AdminTable
          complaints={complaints}
          workers={workers}
          assignWorker={assignWorker}
          updateStatus={updateStatus}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
