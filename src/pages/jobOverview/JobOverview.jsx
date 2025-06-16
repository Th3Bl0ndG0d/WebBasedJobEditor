import { useState } from "react";
import jobDatabase from "../../constants/jobDatabase/jobDemoDatabase.js";
import JobTable from "../../components/jobTable/JobTable.jsx";

const JobOverview = () => {
    const [selectedJobId, setSelectedJobId] = useState(null);

    const handleRowClick = (id) => {
        setSelectedJobId(id === selectedJobId ? null : id);
    };

    const handleDelete = (id) => {
        alert(`Delete job with ID: ${id}`);
    };

    const handleCopy = (id) => {
        alert(`Copy job with ID: ${id}`);
    };

    const handleEdit = (id) => {
        alert(`Edit job with ID: ${id}`);
    };

    return (
        <div className="outer-container job-overview">
            <div className="inner-container--wide job-overview-wrapper">
                <h1 className="job-overview-title">Job Overview</h1>
                <JobTable
                    jobs={jobDatabase}
                    selectedJobId={selectedJobId}
                    onRowClick={handleRowClick}
                    onDelete={handleDelete}
                    onCopy={handleCopy}
                    onEdit={handleEdit}
                />
            </div>
        </div>
    );
};

export default JobOverview;
