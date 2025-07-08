import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobTable from "../../components/jobTable/JobTable.jsx";
import { useAuth } from "../../context/AuthProvider.jsx";
import { getJobs } from "../../helpers/getJobs.js";
import CustomToast from "../../components/cutomToast/CustomToast.jsx";
import { deleteJob } from "../../helpers/deleteJob.js";
import { createDebugger } from "../../components/debugger/createDebugger.jsx";

// ✅ Debugger instellen
const debug = createDebugger({
    enableConsole: true,
    enableToast: true,
    toastTypes: {
        success: true,
        error: true,
        info: true,
        warning: true,
        debug: false,
    }
});

const JobOverview = () => {
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("🔍 useEffect triggered. Gebruiker:", user);

        async function fetchJobs() {
            if (!user?.token) {
                console.warn("Geen token aanwezig. Ophalen jobs wordt overgeslagen.");
                debug.notify("warning", "Geen token gevonden. Ophalen jobs wordt overgeslagen.");
                return;
            }

            debug.notify("info", "Start ophalen van jobs...");
            console.log("📡 Start ophalen van jobs met token:", user.token);
            setLoading(true);

            try {
                const data = await getJobs(user.token);
                console.log("✅ Ontvangen jobs:", data);

                if (data) {
                    setJobs(data);
                    debug.notify("success", `Er zijn ${data.length} jobs geladen.`);
                } else {
                    debug.notify("warning", "Geen jobs ontvangen van server.");
                    console.warn("⚠️ Geen jobs ontvangen (null of leeg).");
                }
            } catch (error) {
                console.error("❌ Fout bij ophalen van jobs:", error);
                debug.notify("error", "Fout bij ophalen van jobs. Zie console.");
            } finally {
                setLoading(false);
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
        debug.notify("info", `Verzoek tot verwijderen van job ID: ${id}`);

        const confirmed = window.confirm("Weet je zeker dat je deze job wilt verwijderen?");
        if (!confirmed) {
            debug.notify("info", "Verwijderen geannuleerd door gebruiker.");
            console.log("❌ Verwijderen geannuleerd door gebruiker.");
            return;
        }

        const success = await deleteJob(id);
        if (success) {
            debug.notify("success", `Job ID ${id} succesvol verwijderd.`);
            CustomToast.success("Job succesvol verwijderd.");
            setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
            setSelectedJobId(null);
        } else {
            debug.notify("error", `Verwijderen van job ID ${id} is mislukt.`);
            CustomToast.error("Verwijderen van job is mislukt.");
        }
    };

    const handleCopy = (id) => {
        debug.notify("info", `Job ID ${id} kopiëren (nog niet geïmplementeerd).`);
        console.log(`📄 Verzoek tot kopiëren van job met ID: ${id}`);
        alert(`Copy job with ID: ${id}`);
    };

    const handleEdit = (id) => {
        debug.notify("info", `Navigeren naar edit-pagina voor job ID ${id}`);
        console.log(`✏️ Navigeren naar edit-pagina voor job ID: ${id}`);
        navigate(`/job/${id}`);
    };

    return (
        <div className="outer-container job-overview">
            <div className="inner-container--wide job-overview-wrapper">
                <h1 className="job-overview-title">Job overzicht</h1>

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
