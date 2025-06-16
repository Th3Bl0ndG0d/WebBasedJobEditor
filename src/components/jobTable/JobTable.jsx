// import React from "react";
// import { FiTrash2, FiCopy, FiEdit } from "react-icons/fi";
// import "./JobTable.css"; // of aparte css als nodig
//
// const JobTable = ({ jobs, selectedJobId, onRowClick, onDelete, onCopy, onEdit }) => {
//     return (
//         <table className="table-styled job-overview-table">
//             <thead>
//             <tr>
//                 <th>ID</th>
//                 <th>Number</th>
//                 <th>Name</th>
//                 <th>Info</th>
//                 <th>Repeat</th>
//                 <th># Cylinders</th>
//                 <th>Actions</th>
//             </tr>
//             </thead>
//             <tbody>
//                 {jobs.map(job => (
//                     <tr
//                         key={job.id}
//                         className={job.id === selectedJobId ? "selected-row" : ""}
//                         onClick={() => onRowClick(job.id)}
//                     >
//                         <td>{job.id}</td>
//                         <td>{job.number}</td>
//                         <td>{job.name}</td>
//                         <td>{job.info}</td>
//                         <td>{job.repeat}</td>
//                         <td>{job.cylinders ? job.cylinders.length : 0}</td>
//                         <td>
//                             {job.id === selectedJobId && (
//                                 <div className="action-icons">
//                                     <FiTrash2
//                                         className="icon delete-icon"
//                                         title="Delete"
//                                         onClick={(e) => { e.stopPropagation(); onDelete(job.id); }}
//                                     />
//                                     <FiCopy
//                                         className="icon copy-icon"
//                                         title="Copy"
//                                         onClick={(e) => { e.stopPropagation(); onCopy(job.id); }}
//                                     />
//                                     <FiEdit
//                                         className="icon edit-icon"
//                                         title="Edit"
//                                         onClick={(e) => { e.stopPropagation(); onEdit(job.id); }}
//                                     />
//                                 </div>
//                             )}
//                         </td>
//                     </tr>
//                 ))}
//             </tbody>
//         </table>
//     );
// };
//
// export default JobTable;

import React from "react";
import { FiTrash2, FiCopy, FiEdit } from "react-icons/fi";
import "./JobTable.css"; // importeer bijbehorende styling

const JobTable = ({ jobs, selectedJobId, onRowClick, onDelete, onCopy, onEdit }) => {
    return (
        <table className="table-styled job-overview-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Number</th>
                <th>Name</th>
                <th>Info</th>
                <th>Repeat</th>
                <th># Cylinders</th>
                <th>Actions</th> {/* Vaste kolom voor acties */}
            </tr>
            </thead>
            <tbody>
            {jobs.map(job => (
                <tr
                    key={job.id}
                    className={job.id === selectedJobId ? "selected-row" : ""}
                    onClick={() => onRowClick(job.id)}
                >
                    <td>{job.id}</td>
                    <td>{job.number}</td>
                    <td>{job.name}</td>
                    <td>{job.info}</td>
                    <td>{job.repeat}</td>
                    <td>{job.cylinders ? job.cylinders.length : 0}</td>
                    <td>
                        <div className="action-icons-placeholder">
                            {/* Altijd dezelfde HTML-structuur tonen, enkel visibility wijzigen */}
                            <div
                                className="action-icons"
                                style={{ visibility: job.id === selectedJobId ? 'visible' : 'hidden' }}
                            >
                                <FiTrash2
                                    className="icon delete-icon"
                                    title="Delete"
                                    onClick={(e) => { e.stopPropagation(); onDelete(job.id); }}
                                />
                                <FiCopy
                                    className="icon copy-icon"
                                    title="Copy"
                                    onClick={(e) => { e.stopPropagation(); onCopy(job.id); }}
                                />
                                <FiEdit
                                    className="icon edit-icon"
                                    title="Edit"
                                    onClick={(e) => { e.stopPropagation(); onEdit(job.id); }}
                                />
                            </div>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default JobTable;
