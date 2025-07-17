import './JobDetails.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {getJobById} from "../../helpers/getJobByID.js";

const JobDetail = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchJob = async () => {
            const result = await getJobById(jobId,token);
            setJob(result);
            setLoading(false);
        };

        fetchJob();
    }, [jobId]);

    if (loading) {
        return <p>⏳ Laden...</p>;
    }

    if (!job) {
        return <p>❌ Job niet gevonden.</p>;
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
