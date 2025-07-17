import './JobDetails.css';
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { getJobById } from "../../helpers/getJobByID.js";
import getValidTokenOrLogout from "../../helpers/getValidTokenOrLogout.js";
import { AuthContext } from "../../context/AuthProvider.jsx";

/**
 * Component: JobDetail
 * Doel: Haalt de details op van een specifieke job op basis van het jobId uit de route.
 * Controleert vooraf of de JWT-token nog geldig is, en logt de gebruiker uit bij sessieverval.
 */
const JobDetail = () => {
    const { jobId } = useParams(); // Haalt de job-ID op uit de URL-parameters
    const [job, setJob] = useState(null); // Status voor de opgevraagde jobdata
    const [loading, setLoading] = useState(true); // Laadindicator
    const { logout } = useContext(AuthContext); // Logoutfunctie uit context

    /**
     * useEffect: wordt uitgevoerd bij mount of wanneer jobId wijzigt.
     * Controleert de geldigheid van de token en haalt vervolgens de jobdetails op.
     */
    useEffect(() => {
        const token = getValidTokenOrLogout(logout); // Valideert token of logt uit bij verlopen sessie
        if (!token) return; // Bij ongeldige token ben je al uitgelogd

        const fetchJob = async () => {
            const result = await getJobById(jobId, token); // API-aanroep met geldige token
            setJob(result); // Zet opgehaalde job in state
            setLoading(false); // Laadstatus afronden
        };

        fetchJob();
    }, [jobId]);

    // Render: laadstatus tonen zolang data nog wordt opgehaald
    if (loading) {
        return <p>Laden...</p>;
    }

    // Render: foutmelding bij ontbreken van jobdata
    if (!job) {
        return <p>Job niet gevonden.</p>;
    }

    // Render: detailweergave van de opgehaalde job
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
