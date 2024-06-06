import React from 'react';
import '../css/ComplaintsTable.css';

const ComplaintsTable = ({ complaints, markAsDone }) => {
    return (
        <table className="complaints-table">
            <thead>
                <tr>
                    {/* <th>Identifier</th> */}
                    <th>Title</th>
                    <th>Issue</th>
                    <th>Location</th>
                    <th>Assigned Worker</th>
                    <th>Status</th>
                    <th>Actions</th> 
                </tr>
            </thead>
            <tbody>
                {complaints.map((complaint, index) => (
                    <tr key={index}>
                        {/* <td>{complaint.identifier}</td> */}
                        <td>{complaint.title}</td>
                        <td>{complaint.issue}</td>
                        <td>{complaint.location}</td>
                        <td>{complaint.assignedWorker}</td>
                        <td>{complaint.status}</td>
                        <td>
                            {complaint.status === 'In Progress' && (
                                <button onClick={() => markAsDone(index)}>Mark as Done</button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ComplaintsTable;
