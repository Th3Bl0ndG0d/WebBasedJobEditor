// import { useState } from "react";
// import jobDatabase from "../../constants/jobDatabase/jobDemoDatabase.js";
// import JobTable from "../../components/jobTable/JobTable.jsx";
//
// const JobOverview = () => {
//     const [selectedJobId, setSelectedJobId] = useState(null);
//
//     const handleRowClick = (id) => {
//         setSelectedJobId(id === selectedJobId ? null : id);
//     };
//
//     const handleDelete = (id) => {
//         alert(`Delete job with ID: ${id}`);
//     };
//
//     const handleCopy = (id) => {
//         alert(`Copy job with ID: ${id}`);
//     };
//
//     const handleEdit = (id) => {
//         alert(`Edit job with ID: ${id}`);
//     };
//
//     return (
//         <div className="outer-container job-overview">
//             <div className="inner-container--wide job-overview-wrapper">
//                 <h1 className="job-overview-title">Job Overview</h1>
//                 <JobTable
//                     jobs={jobDatabase}
//                     selectedJobId={selectedJobId}
//                     onRowClick={handleRowClick}
//                     onDelete={handleDelete}
//                     onCopy={handleCopy}
//                     onEdit={handleEdit}
//                 />
//             </div>
//         </div>
//     );
// };
//
// export default JobOverview;
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // toegevoegd
import jobDatabase from "../../constants/jobDatabase/jobDemoDatabase.js";
import JobTable from "../../components/jobTable/JobTable.jsx";

const JobOverview = () => {
    const [selectedJobId, setSelectedJobId] = useState(null);
    const navigate = useNavigate(); //  hook initialiseren

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
        //  navigeer naar de detailpagina van de job
        navigate(`/job/${id}`);
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
                    onEdit={handleEdit} // wijst nu naar navigate-functie
                />
            </div>
        </div>
    );
};

export default JobOverview;