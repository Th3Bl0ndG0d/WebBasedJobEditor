import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobTable from "../../components/jobTable/JobTable.jsx";
import { useAuth } from "../../context/AuthProvider.jsx";
import { getJobs } from "../../helpers/getJobs.js";
import CustomToast from "../../components/cutomToast/CustomToast.jsx";
import { deleteJob } from "../../helpers/deleteJob.js";
import { createDebugger } from "../../components/debugger/createDebugger.jsx";

// Debugger instellen
const debug = createDebugger({
    enableConsole: true,
    enableToast: false,
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
        debug.notify("debug", "useEffect triggered. Gebruiker:", user);
        async function fetchJobs() {
            if (!user?.token) {
                debug.notify("warning", "Geen token gevonden. Ophalen jobs wordt overgeslagen.");
                return;
            }

            debug.notify("debug", "Start ophalen van jobs...");
            setLoading(true);

            try {
                const data = await getJobs(user.token);
                debug.notify("warning", "Ontvangen jobs:", data);

                if (data) {
                    setJobs(data);
                    debug.notify("success", `Er zijn ${data.length} jobs geladen.`);
                } else {
                    debug.notify("warning", "Geen jobs ontvangen van server.");

                }
            } catch (error) {
                debug.notify("error", "Fout bij ophalen van jobs. Zie console.",error);
            } finally {
                setLoading(false);
            }
        }

        fetchJobs();
    }, [user?.token]);

    const handleRowClick = (id) => {
        const newSelected = id === selectedJobId ? null : id;
        debug.notify("debug", `Rij geklikt: ${id}. Nieuw geselecteerd ID: ${newSelected}`);
        setSelectedJobId(newSelected);
    };

    const handleDelete = async (id) => {
        debug.notify("info", `Verzoek tot verwijderen van job ID: ${id}`);

        // const confirmed = window.confirm("Weet je zeker dat je deze job wilt verwijderen?");
        // if (!confirmed) {
        //     debug.notify("info", "Verwijderen geannuleerd door gebruiker.");
        //     return;
        // }

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
    };

    const handleEdit = (id) => {
        debug.notify("info", `Navigeren naar edit-pagina voor job ID ${id}`);
        navigate(`/job/${id}`);
    };

    return (
        <div className="outer-container job-overview">
            <div className="inner-container--wide job-overview-wrapper">
                <h1 className="job-overview-title">Job overzicht</h1>

                {loading ? (
                    <p className="job-loading-message">
                        Jobs worden geladen...
                    </p>
                ) : jobs.length === 0 ? (
                    <p className="job-empty-message">Geen jobs gevonden. Creer een nieuwe job.</p>
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
