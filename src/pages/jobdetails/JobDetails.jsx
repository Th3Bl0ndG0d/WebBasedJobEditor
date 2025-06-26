import './JobDetails.css';
import { useParams } from "react-router-dom";
import jobDatabase from "../../constants/jobDatabase/jobDemoDatabase.js";

const JobDetail = () => {
    const { jobId } = useParams();
    const job = jobDatabase.find((j) => j.id.toString() === jobId);

    if (!job) {
        return <p>Job not found.</p>;
    }

    return (
        <div className="outer-container">
            <div className="inner-container--wide">
                <h1>Job Detail: {job.name}</h1>
                <pre>{JSON.stringify(job, null, 2)}</pre>
            </div>
        </div>
    );
};

export default JobDetail;
