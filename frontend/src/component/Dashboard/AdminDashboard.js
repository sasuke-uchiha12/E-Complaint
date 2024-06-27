import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import AdminHeader from '../AdminHeader';
import AdminTable from '../AdminTable';
import './AdminDashboard.css';

const socket = io('http://localhost:5000');

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [workers] = useState(['Worker 1', 'Worker 2', 'Worker 3', 'Worker 4', 'Worker 5', 'Worker 6', 'Worker 7', 'Worker 8', 'Worker 9']);

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
            const res = await axios.get('http://localhost:5000/api/complaints');
            setComplaints(res.data);
        } catch (error) {
            console.error('There was an error fetching the complaints!', error);
        }
    };

    const assignWorker = async (index, worker) => {
        try {
            const updatedComplaint = await axios.patch(`http://localhost:5000/api/complaints/assign/${complaints[index]._id}`, { assignedWorker: worker });
            setComplaints((prevComplaints) => 
                prevComplaints.map((complaint, i) => 
                    i === index ? updatedComplaint.data : complaint
                )
            );
        } catch (error) {
            console.error('There was an error assigning the worker!', error);
        }
    };

    const updateStatus = async (index, status) => {
        try {
            const updatedComplaint = await axios.patch(`http://localhost:5000/api/complaints/status/${complaints[index]._id}`, { status });
            setComplaints((prevComplaints) => 
                prevComplaints.map((complaint, i) => 
                    i === index ? updatedComplaint.data : complaint
                )
            );
        } catch (error) {
            console.error('There was an error updating the status!', error);
        }
    };

    const markAsDelayed = async (index) => {
        try {
            const updatedComplaint = await axios.patch(`http://localhost:5000/api/complaints/delay/${complaints[index]._id}`);
            setComplaints((prevComplaints) =>
                prevComplaints.map((complaint, i) =>
                    i === index ? updatedComplaint.data : complaint
                )
            );
        } catch (error) {
            console.error('There was an error marking the complaint as delayed!', error);
        }
    };

    const resumeWork = async (index) => {
        try {
            const updatedComplaint = await axios.patch(`http://localhost:5000/api/complaints/resume/${complaints[index]._id}`, { assignedWorker: complaints[index].assignedWorker });
            setComplaints((prevComplaints) =>
                prevComplaints.map((complaint, i) =>
                    i === index ? updatedComplaint.data : complaint
                )
            );
        } catch (error) {
            console.error('There was an error resuming the work on the complaint!', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminHeader />
            <AdminTable 
                complaints={complaints} 
                workers={workers} 
                assignWorker={assignWorker} 
                updateStatus={updateStatus} 
                markAsDelayed={markAsDelayed} 
                resumeWork={resumeWork} 
            />
        </div>
    );
};

export default AdminDashboard;
