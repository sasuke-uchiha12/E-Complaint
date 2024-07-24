import React, { useState } from 'react';
import axios from 'axios';
import '../css/ComplaintsForm.css'

function ComplaintForm({ onSubmit }) {
    const [complaintData, setComplaintData] = useState({
        title: '',
        issue: '',
        location: '',
        phone: '',
        priority: 'low',
        department: localStorage.getItem('department'), // Automatically get the department from local storage
        assignedWorker: '',
        status: 'Pending',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setComplaintData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        setComplaintData((prevData) => ({ ...prevData, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(complaintData).forEach((key) => {
                formData.append(key, complaintData[key]);
            });

            const token = localStorage.getItem('token'); // Get the token from local storage

            const res = await axios.post('http://localhost:5000/api/complaints', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Include the token in the request headers
                },
            });
            onSubmit(res.data);
            setComplaintData({
                title: '',
                issue: '',
                location: '',
                phone: '',
                priority: 'low',
                department: localStorage.getItem('department'), // Reset the department
                assignedWorker: '',
                status: 'Pending',
                image: null,
            });
        } catch (error) {
            console.error('There was an error submitting the complaint!', error);
        }
    };

    return (
        <div className="complaint-form-container">
            <form className="complaint-form" onSubmit={handleSubmit} encType="multipart/form-data">
                <h1>Complaint Form</h1>
                <div className="input-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={complaintData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="issue">Issue</label>
                    <textarea
                        id="issue"
                        name="issue"
                        value={complaintData.issue}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={complaintData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={complaintData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        name="priority"
                        value={complaintData.priority}
                        onChange={handleChange}
                        required
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="image">Image (Optional)</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                </div>
                <button type="submit">Submit Complaint</button>
            </form>
        </div>
    );
}

export default ComplaintForm;
