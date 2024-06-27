import React, { useState, useEffect } from 'react';
import ComplaintForm from '../ComplaintForm';
import ComplaintsTable from '../ComplaintsTable';
import DashHeader from '../DashHeader';
import axios from 'axios';
import './DepartmentDashboard.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const DepartmentDashboard = () => {
    const [showForm, setShowForm] = useState(false);
    const [complaints, setComplaints] = useState([]);

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

    const handleFormSubmit = (newComplaint) => {
        setComplaints([...complaints, newComplaint]);
        setShowForm(false);
    };

    const markAsDone = async (index) => {
        try {
            const updatedComplaint = { ...complaints[index], status: 'Done' };
            await axios.patch(`http://localhost:5000/api/complaints/mark-done/${complaints[index]._id}`, updatedComplaint);
            setComplaints((prevComplaints) => 
                prevComplaints.map((complaint, i) => 
                    i === index ? updatedComplaint : complaint
                )
            );
        } catch (error) {
            console.error('There was an error updating the complaint!', error);
        }
    };

    const toggleFormVisibility = () => {
        setShowForm(!showForm);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowForm(false);
        }
    };

    return (
        <div>
            <DashHeader />
            <div className={`dashboard ${showForm ? 'overlay-active' : ''}`}>
                {showForm && (
                    <div className="form-overlay" onClick={handleOverlayClick}>
                        <div className="form-container" onClick={(e) => e.stopPropagation()}>
                            <ComplaintForm onSubmit={handleFormSubmit} />
                        </div>
                    </div>
                )}
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <h1>Complaints</h1>
                        <button onClick={toggleFormVisibility} style= {{padding: "10px 20px"}}>Add New Complaint</button>
                    </div>
                    <ComplaintsTable complaints={complaints} markAsDone={markAsDone} />
                </div>
            </div>
        </div>
    );
};

export default DepartmentDashboard;
