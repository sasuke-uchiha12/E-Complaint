import React from 'react';
import '../css/ComplaintsTable.css';

const ComplaintsTable = ({ complaints, updateStatus }) => {
  return (
    <div className="complaints-table-container">
      <table className="complaints-table">
        <thead>
          <tr>
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
              <td>{complaint.title}</td>
              <td>{complaint.issue}</td>
              <td>{complaint.location}</td>
              <td>{complaint.assignedWorker}</td>
              <td>{complaint.status}</td>
              <td>
                {complaint.status === 'In Progress' && (
                  <button onClick={() => updateStatus(index, 'Done')} style={{ padding: "5px 10px" }}>Mark as Done</button>
                )}
                {complaint.status === 'Done' && (
                  <button onClick={() => updateStatus(index, 'Completed')} style={{ padding: "5px 10px" }}>Mark as Completed</button>
                )}
                {complaint.status === 'Completed' && (
                  <button onClick={() => updateStatus(index, 'In Progress')} style={{ padding: "5px 10px" }}>Revert to In Progress</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintsTable;
