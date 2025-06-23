// Importeer React-bibliotheek om functionele componenten te kunnen definiëren
import React from "react";

// Importeer drie react-icons voor de acties: verwijderen, kopiëren en bewerken
import { FiTrash2, FiCopy, FiEdit } from "react-icons/fi";

// Importeer de bijbehorende CSS-bestand waarin de opmaak van de tabel en iconen gedefinieerd is
import "./JobTable.css";

/**
 * De `JobTable` component visualiseert een lijst van jobs in tabelvorm.
 * De component toont per rij de details van een job, met optioneel actie-iconen voor de geselecteerde job.
 *
 * Props:
 * - jobs: Array van job-objecten met minimaal id, number, name, info, repeat, cylinders
 * - selectedJobId: Id van de momenteel geselecteerde job
 * - onRowClick: Callbackfunctie bij het aanklikken van een rij (job selecteren)
 * - onDelete: Callbackfunctie bij verwijderen van een job
 * - onCopy: Callbackfunctie bij kopiëren van een job
 * - onEdit: Callbackfunctie bij bewerken van een job
 */
const JobTable = ({ jobs, selectedJobId, onRowClick, onDelete, onCopy, onEdit }) => {
    return (
        // Tabelcontainer met CSS-klassen voor algemene en specifieke styling
        <table className="table-styled job-overview-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Number</th>
                <th>Name</th>
                <th>Info</th>
                <th>Repeat</th>
                <th># Cylinders</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {/* Itereer over alle jobs en render per job een rij */}
            {jobs.map(job => (
                <tr
                    key={job.id} // Unieke sleutel per rij voor React rendering
                    className={job.id === selectedJobId ? "selected-row" : ""} // Highlight geselecteerde rij
                    onClick={() => onRowClick(job.id)} // Selecteer job bij klik
                >
                    <td>{job.id}</td>
                    <td>{job.number}</td>
                    <td>{job.name}</td>
                    <td>{job.info}</td>
                    <td>{job.repeat}</td>
                    <td>{job.cylinders ? job.cylinders.length : 0}</td>
                    {/* Toon jobgegevens in aparte kolommen */}
                    <td>
                        {/* Container voor actie-iconen, altijd renderen voor structurele consistentie */}
                        <div className="action-icons-placeholder">
                            {/* Enkel zichtbaar indien job geselecteerd is; voorkomt layoutverschuiving */}
                            <div
                                className="action-icons"
                                style={{ visibility: job.id === selectedJobId ? 'visible' : 'hidden' }}
                            >
                                {/* Verwijder-icoon: stopt eventbubbling om selectie niet te wijzigen */}
                                <FiTrash2
                                    className="icon delete-icon"
                                    title="Delete"
                                    onClick={(e) => {
                                        e.stopPropagation(); // voorkom triggeren van onRowClick
                                        onDelete(job.id);    // roep delete-functie aan
                                    }}
                                />
                                {/* Kopieer-icoon: werkt gelijkaardig */}
                                <FiCopy
                                    className="icon copy-icon"
                                    title="Copy"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onCopy(job.id);
                                    }}
                                />
                                {/* Bewerken-icoon: idem */}
                                <FiEdit
                                    className="icon edit-icon"
                                    title="Edit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(job.id);
                                    }}
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

// Exporteer de component voor gebruik in andere delen van de applicatie
export default JobTable;
