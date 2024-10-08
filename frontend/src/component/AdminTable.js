import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ComplaintPDF from './ComplaintPDF';
import '../css/AdminTable.css';

const AdminTable = ({ complaints, workers, assignWorker, updateStatus, markAsDelayed, resumeWork }) => {
    return (
        <div className="complaints-table-container">
            <table className="complaints-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Details</th>
                        <th>Location</th>
                        <th>Assigned Worker</th>
                        <th>Status</th>
                        <th>Actions</th>
                        <th>Download</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map((complaint, index) => (
                        <tr key={index}>
                            <td>{complaint.title}</td>
                            <td>{complaint.issue}</td>
                            <td>{complaint.location}</td>
                            <td>
                                {complaint.assignedWorker || (
                                    <select onChange={(e) => assignWorker(index, e.target.value)} defaultValue="">
                                        <option value="" disabled>Select Worker</option>
                                        {workers.map((worker, i) => (
                                            <option key={i} value={worker}>{worker}</option>
                                        ))}
                                    </select>
                                )}
                            </td>
                            <td>{complaint.status}</td>
                            <td>
                                {complaint.status === 'Done' && (
                                    <button onClick={() => updateStatus(index, 'Completed')}>Verify and Mark as Completed</button>
                                )}
                                {complaint.status === 'In Progress' && (
                                    <button onClick={() => updateStatus(index, 'Pending')} className="button-spacing">Revert to Pending</button>
                                )}
                                {complaint.status !== 'Delayed' && complaint.status !== 'Done' && complaint.status !== 'Completed' && (
                                    <button onClick={() => markAsDelayed(index)} className="button-spacing">Mark as Delayed</button>
                                )}
                                {complaint.status === 'Delayed' && (
                                    <button onClick={() => resumeWork(index)} className="button-spacing">Resume Work</button>
                                )}
                            </td>
                            <td>
                                {complaint.status !== 'Delayed' && (
                                    <PDFDownloadLink
                                        document={<ComplaintPDF complaint={complaint} />}
                                        fileName={`complaint_${complaint._id}.pdf`}
                                    >
                                        {({ loading }) => (
                                            <button className="download-button">
                                                {loading ? 'Generating PDF...' : 'Download PDF'}
                                            </button>
                                        )}
                                    </PDFDownloadLink>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTable;
