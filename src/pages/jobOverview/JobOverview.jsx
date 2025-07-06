import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobTable from "../../components/jobTable/JobTable.jsx";
import { useAuth } from "../../context/AuthProvider.jsx";
import { getJobs } from "../../helpers/getJobs.js";
import CustomToast from "../../components/cutomToast/CustomToast.jsx";
import {deleteJob} from "../../helpers/deleteJob.js";

const JobOverview = () => {
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false); // ✅ toegevoegd
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("🔍 useEffect triggered. Gebruiker:", user);

        async function fetchJobs() {
            if (!user?.token) {
                console.warn("⚠️ Geen token aanwezig. Ophalen jobs wordt overgeslagen.");
                return;
            }

            console.log("📡 Start ophalen van jobs met token:", user.token);
            setLoading(true); // ✅ zet loading aan

            try {
                const data = await getJobs(user.token);
                console.log("✅ Ontvangen jobs:", data);

                if (data) {
                    setJobs(data);
                } else {
                    console.warn("⚠️ Geen jobs ontvangen (null of leeg).");
                }
            } catch (error) {
                console.error("❌ Fout bij ophalen van jobs:", error);
            } finally {
                setLoading(false); // ✅ zet loading uit
            }
        }

        fetchJobs();
    }, [user?.token]);

    const handleRowClick = (id) => {
        const newSelected = id === selectedJobId ? null : id;
        console.log(`👆 Rij geklikt: ${id}. Nieuw geselecteerd ID: ${newSelected}`);
        setSelectedJobId(newSelected);
    };

    const handleDelete = async (id) => {
        console.log(`🗑️ Verzoek tot verwijderen van job met ID: ${id}`);

        const confirmed = window.confirm("Weet je zeker dat je deze job wilt verwijderen?");
        if (!confirmed) {
            console.log("❌ Verwijderen geannuleerd door gebruiker.");
            return;
        }

        const success = await deleteJob(id); // gebruik custom toast
        if (success) {
            CustomToast.success("✅ Job succesvol verwijderd.");
            setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
            setSelectedJobId(null);
        } else {
            CustomToast.error("❌ Verwijderen van job is mislukt.");
        }
    };


    const handleCopy = (id) => {
        console.log(`📄 Verzoek tot kopiëren van job met ID: ${id}`);
        alert(`Copy job with ID: ${id}`);
    };

    const handleEdit = (id) => {
        console.log(`✏️ Navigeren naar edit-pagina voor job ID: ${id}`);
        navigate(`/job/${id}`);
    };

    return (
        <div className="outer-container job-overview">
            <div className="inner-container--wide job-overview-wrapper">
                <h1 className="job-overview-title">Job Overview</h1>

                {loading ? (
                    <p className="job-loading-message">
                        ⏳ Jobs worden geladen...
                    </p>
                ) : (
                    <JobTable
                        jobs={jobs}
                        selectedJobId={selectedJobId}
                        onRowClick={handleRowClick}
                        onDelete={handleDelete}
                        onCopy={handleCopy}
                        onEdit={handleEdit}
                    />
                )}
            </div>
        </div>
    );
};

export default JobOverview;
