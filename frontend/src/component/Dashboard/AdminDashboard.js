import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ComplaintsTable from '../ComplaintsTable';
import DashHeader from '../DashHeader';
import './AdminDashboard.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const workers = ['Worker 1', 'Worker 2', 'Worker 3'];

    const fetchComplaints = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/admin/complaints', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setComplaints(res.data);
        } catch (error) {
            console.error('There was an error fetching the complaints!', error);
        }
    }, []);

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
    }, [fetchComplaints]);

    const assignWorker = async (index, worker) => {
        try {
            const token = localStorage.getItem('token');
            const updatedComplaint = { ...complaints[index], assignedWorker: worker, status: 'In Progress' };
            await axios.patch(`http://localhost:5000/api/complaint/assign/${complaints[index]._id}`, updatedComplaint, {
                headers: {
                    'Authorization': `Bearer ${token}`
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

    const markAsDone = async (index) => {
        try {
            const token = localStorage.getItem('token');
            const updatedComplaint = { ...complaints[index], status: 'Done' };
            await axios.patch(`http://localhost:5000/api/complaint/mark-done/${complaints[index]._id}`, updatedComplaint, {
                headers: {
                    'Authorization': `Bearer ${token}`
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
            const token = localStorage.getItem('token');
            const updatedComplaint = { ...complaints[index], status };
            await axios.patch(`http://localhost:5000/api/complaint/status/${complaints[index]._id}`, updatedComplaint, {
                headers: {
                    'Authorization': `Bearer ${token}`
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

    const markAsDelayed = async (index) => {
        try {
            const token = localStorage.getItem('token');
            const updatedComplaint = await axios.patch(`http://localhost:5000/api/complaint/delay/${complaints[index]._id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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
            const token = localStorage.getItem('token');
            const updatedComplaint = await axios.patch(`http://localhost:5000/api/complaint/resume/${complaints[index]._id}`, { assignedWorker: complaints[index].assignedWorker }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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
        <div>
            <DashHeader />
            <div className="dashboard-container">
                <h1>Admin Dashboard</h1>
                <ComplaintsTable
                    complaints={complaints}
                    workers={workers}
                    assignWorker={assignWorker}
                    updateStatus={updateStatus}
                    markAsDelayed={markAsDelayed}
                    resumeWork={resumeWork}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
