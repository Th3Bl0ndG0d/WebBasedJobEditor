import React, {useContext, useState} from "react";
import "./JobCreator.css";
import Cylinder from "../../constants/cylinder/cylinder";
import Plate from "../../constants/plate/plate";
import Job from "../../constants/job/job";
import Button from "../../components/button/Button.jsx";
import { createFullJob } from "../../helpers/jobAPI.js";

import InputField from "../../components/inputField/InputField.jsx";
import FormGroup from "../../components/formGroup/formGroup.jsx";
import FormGrid from "../../components/formGrid/FromGrid.jsx";
import InputWithButtonControls from "../../components/inputWithButtonControls/InputWithButtonControls.jsx";
import {Link} from "react-router-dom";
import {createDebugger} from "../../components/debugger/createDebugger.jsx";
import CustomToast from "../../components/cutomToast/CustomToast.jsx";
import {AuthContext} from "../../context/AuthProvider.jsx";
import getValidTokenOrLogout from "../../helpers/getValidTokenOrLogout.js";
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
/**
 * Component: JobCreator
 * Doel: Faciliteert het aanmaken van een Job-object inclusief bijbehorende cylinders en platen.
 * Gebruikt een gestandaardiseerde invoerstructuur en valideert de essentiële invoervelden alvorens het object te genereren.
 */
const JobCreator = () => {
    const { logout } = useContext(AuthContext);
    // Interne status voor de algemene jobmetadata (nummer, naam, info)
    const [jobDetails, setJobDetails] = useState({
        number: "",
        name: "",
        info: "",
        repeat: 1250
    });

    // Interne status voor repeat van de job (default 1)
    const [repeatByCylinder, setRepeatByCylinder] = useState(1250);

    // Sjabloonplaat (wordt gekopieerd naar alle platen binnen cylinders)
    const [templatePlate, setTemplatePlate] = useState({ width: "", topHeight: "", bottomHeight: "", x: "", y: "" });

    // Instellingen voor het aantal cylinders en platen per cylinder
    const [numCylinders, setNumCylinders] = useState(1);
    const [platesPerCylinder, setPlatesPerCylinder] = useState(1);

    // Bevat het volledig gegenereerde jobobject (voor bewerking/verzending)
    const [job, setJob] = useState(null);

    /**
     * Wijzigt één veld binnen de algemene jobmetadata.
     * @param {string} field - veldnaam binnen jobDetails
     * @param {string} value - nieuwe waarde voor dat veld
     */
    const updateJobDetails = (field, value) => {
        setJobDetails({ ...jobDetails, [field]: value });
    };

    /**
     * Genereert een nieuw Job-object op basis van de huidige invoer.
     * Valideert verplichte velden en construeert het object inclusief cylinders en platen.
     */
    const generateJob = () => {
        debug.notify("debug", "Genereer job gestart...");
        // Minimale validatie: nummer en naam zijn verplicht
        if (!jobDetails.number || !jobDetails.name) {
            debug.notify("error", "Vul ten minste 'Number' en 'Name' in voor de job.");
            return;
        }

        // Validatie van het herhalingsgetal (mag niet leeg of NaN zijn)
        if (!repeatByCylinder || isNaN(repeatByCylinder)) {
            debug.notify("error", "Vul een geldig getal in voor 'Repeat'.");
            return;
        }

        // Validatie van sjabloonplaat-velden
        const requiredFields = ["width", "topHeight", "bottomHeight", "x", "y"];
        for (const field of requiredFields) {
            if (!templatePlate[field].trim()) {
                debug.notify("error", `Veld "${field}" van de plate mag niet leeg zijn.`);
                return;
            }
        }

        // Unieke ID op basis van timestamp
        const generatedId = Date.now();
        const dataValue = new Date().toISOString();
        let plateId = 1;
        const cylinders = [];

        // Opbouw van alle cylinders en bijbehorende platen
        for (let c = 1; c <= numCylinders; c++) {
            const plates = [];
            for (let p = 0; p < platesPerCylinder; p++) {
                plates.push(Plate(
                    plateId++,
                    templatePlate.width,
                    templatePlate.topHeight,
                    templatePlate.bottomHeight,
                    templatePlate.x,
                    templatePlate.y
                ));
            }
            const cylinderName = `Cylinder ${c}`;
            cylinders.push(Cylinder(c + 100, cylinderName, plates));
        }

        // Constructie van het uiteindelijke Job-object met correcte parameterpositie
        const newJob = Job(
            generatedId,
            jobDetails.number,
            jobDetails.name,
            dataValue,
            jobDetails.info,
            repeatByCylinder,
            cylinders
        );
        debug.notify("debug", "Job gegenereerd:", newJob);
        setJob(newJob);
    };

    /**
     * Wijzigt een veld van het hoofdniveau van de job (zoals naam, repeat)
     */
    const updateJobField = (field, value) => {
        setJob({ ...job, [field]: value });
    };

    /**
     * Wijzigt een veld van een specifieke cylinder binnen het jobobject
     */
    const updateCylinder = (id, field, value) => {
        const updated = job.cylinders.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        );
        setJob({ ...job, cylinders: updated });
    };

    /**
     * Wijzigt een veld van een specifieke plate binnen een specifieke cylinder
     */
    const updatePlate = (cylinderId, plateId, field, value) => {
        const updatedCylinders = job.cylinders.map(c => {
            if (c.id === cylinderId) {
                const updatedPlates = c.plates.map(p =>
                    p.id === plateId ? { ...p, [field]: value } : p
                );
                return { ...c, plates: updatedPlates };
            }
            return c;
        });
        setJob({ ...job, cylinders: updatedCylinders });
    };

    /**
     * Verstuurt het gegenereerde jobobject naar de backend via de API.
     * Geeft feedback via toastmeldingen.
     */
    const submitJob = async () => {
        const token = getValidTokenOrLogout(logout); // Tokencontrole vóór verzenden
        if (!token) return; // User is uitgelogd bij ongeldige sessie

        debug.notify("debug", "Job wordt aangemaakt...");

        const response = await createFullJob(job, token);

        if (response) {
            debug.notify("succes", "Job wordt aangemaakt...");
            CustomToast.success(
                <>
                    Job <strong>{job.name}</strong> is aangemaakt.<br />
                    <Link to={`/jobOverview`} className="link-button">
                        ➤ Ga naar job overzicht
                    </Link>
                </>,
                { autoClose: 6000 }
            );

            // Reset formulier
            setJob(null);
            setJobDetails({ number: "", name: "", info: "", repeat: 1250 });
        } else {
            debug.notify("error", "Fout bij jobcreatie.");
        }
    };





    // Render de component
    return (
        <div className="outer-container job-editor-wrapper">
            <div className="inner-container--wide job-editor">
                <h1 className="title">JOB CREATOR</h1>

                {/* === Stap 1: Jobconfiguratie-invoer === */}
                {!job && (
                    <>
                        {/* Algemene jobgegevens */}
                        <section className="boxed-section">
                            <h2 className="section-title boxed-section-title">JobData</h2>
                            <FormGrid direction="row" theme="dark">
                                <FormGroup label="Number" htmlFor="job-number">
                                    <InputField
                                        id="job-number"
                                        type="text"
                                        inputValue={jobDetails.number}
                                        handleInputChange={(val) => updateJobDetails("number", val)}
                                    />
                                </FormGroup>

                                <FormGroup label="Name" htmlFor="job-name">
                                    <InputField
                                        id="job-name"
                                        type="text"
                                        inputValue={jobDetails.name}
                                        handleInputChange={(val) => updateJobDetails("name", val)}
                                    />
                                </FormGroup>

                                <FormGroup label="Info" htmlFor="job-info">
                                    <InputField
                                        id="job-info"
                                        type="text"
                                        inputValue={jobDetails.info}
                                        handleInputChange={(val) => updateJobDetails("info", val)}
                                    />
                                </FormGroup>
                            </FormGrid>

                        </section>

                        {/* Cylinderinstellingen incl. repeat */}
                        <section className="boxed-section">
                            <h2 className="section-title boxed-section-title">CylinderData</h2>
                            <FormGrid direction="row" theme="dark">
                                <FormGroup label="Repeat" htmlFor="repeat">
                                    <InputField
                                        id="repeat"
                                        type="number"
                                        inputValue={repeatByCylinder}
                                        handleInputChange={(val) => setRepeatByCylinder(parseInt(val) || "")}
                                        variant="narrow"
                                    />
                                </FormGroup>
                            </FormGrid>
                        </section>

                        {/* Plate-sjablooninstellingen */}
                        <section className="boxed-section">
                            <h2 className="section-title boxed-section-title">PlaatData</h2>
                            <FormGrid direction="row" theme="dark">
                                {Object.entries(templatePlate).map(([key, val]) => (
                                    <FormGroup key={key} label={key} htmlFor={`plate-${key}`}>
                                        <InputField
                                            id={`plate-${key}`}
                                            type="text"
                                            inputValue={val}
                                            handleInputChange={(v) => setTemplatePlate({ ...templatePlate, [key]: v })}
                                            variant="narrow"
                                        />
                                    </FormGroup>
                                ))}
                            </FormGrid>

                        </section>

                        <section className="boxed-section">
                            <h2 className="section-title boxed-section-title">Aantal instellingen</h2>

                            <FormGrid theme="dark" spacing="tight" direction="row" layout={"space-evenly"} >
                                <InputWithButtonControls
                                    id="cylinder-amount"
                                    label="# Cylinders"
                                    value={numCylinders}
                                    onChange={setNumCylinders}
                                />
                                <InputWithButtonControls
                                    id="plate-amount"
                                    label="# Plates"
                                    value={platesPerCylinder}
                                    onChange={setPlatesPerCylinder}
                                />
                            </FormGrid>
                        </section>


                        <div className="field-row">
                            <Button type="button" onClick={generateJob} label="Genereer Job" />
                        </div>
                    </>
                )}


                {job && Array.isArray(job.cylinders) && (
                    <>
                        {/* Bewerkbare jobvelden */}
                        <section className="boxed-section">
                            <h2 className="section-title boxed-section-title">JobData</h2>
                            <FormGrid direction="row" theme="dark">
                                <FormGroup label="Number" htmlFor="job-number-edit">
                                    <InputField
                                        id="job-number-edit"
                                        type="text"
                                        inputValue={job.number}
                                        handleInputChange={(val) => updateJobField("number", val)}
                                        variant="narrow"
                                    />
                                </FormGroup>
                                <FormGroup label="Name" htmlFor="job-name-edit">
                                    <InputField
                                        id="job-name-edit"
                                        type="text"
                                        inputValue={job.name}
                                        handleInputChange={(val) => updateJobField("name", val)}
                                        variant="narrow"
                                    />
                                </FormGroup>
                                <FormGroup label="Info" htmlFor="job-info-edit">
                                    <InputField
                                        id="job-info-edit"
                                        type="text"
                                        inputValue={job.info}
                                        handleInputChange={(val) => updateJobField("info", val)}
                                        variant="narrow"
                                    />
                                </FormGroup>
                                <FormGroup label="Date" htmlFor="job-date-edit">
                                    <InputField
                                        id="job-date-edit"
                                        type="text"
                                        inputValue={job.date}
                                        handleInputChange={() => {}}
                                        variant="narrow"
                                        disabled
                                    />
                                </FormGroup>
                                <FormGroup label="Repeat" htmlFor="job-repeat-edit">
                                    <InputField
                                        id="job-repeat-edit"
                                        type="number"
                                        inputValue={job.repeat}
                                        handleInputChange={(val) => updateJobField("repeat", parseInt(val))}
                                        variant="narrow"
                                    />
                                </FormGroup>
                            </FormGrid>
                        </section>

                        {/* Per cylinder: naam en platen */}
                        {job.cylinders.map((cylinder) => (
                            <section className="boxed-section" key={cylinder.id}>
                                <h2 className="section-title boxed-section-title">Cylinder {cylinder.id}</h2>

                                <FormGrid direction="row" theme="dark">
                                    <FormGroup label="Naam" htmlFor={`cylinder-name-${cylinder.id}`}>
                                        <InputField
                                            id={`cylinder-name-${cylinder.id}`}
                                            type="text"
                                            inputValue={cylinder.name}
                                            handleInputChange={(val) => updateCylinder(cylinder.id, "name", val)}
                                            variant="narrow"
                                        />
                                    </FormGroup>
                                </FormGrid>

                                {cylinder.plates.map((plate) => (
                                    <FormGrid direction="row" theme="dark" key={plate.id}>
                                        <span>Plate {plate.id}</span>

                                        <FormGroup label="Width" htmlFor={`plate-${plate.id}-width`}>
                                            <InputField
                                                id={`plate-${plate.id}-width`}
                                                type="text"
                                                inputValue={plate.width}
                                                handleInputChange={(val) =>
                                                    updatePlate(cylinder.id, plate.id, "width", val)
                                                }
                                                variant="narrow"
                                            />
                                        </FormGroup>

                                        <FormGroup label="Top Height" htmlFor={`plate-${plate.id}-topHeight`}>
                                            <InputField
                                                id={`plate-${plate.id}-topHeight`}
                                                type="text"
                                                inputValue={plate.topHeight}
                                                handleInputChange={(val) =>
                                                    updatePlate(cylinder.id, plate.id, "topHeight", val)
                                                }
                                                variant="narrow"
                                            />
                                        </FormGroup>

                                        <FormGroup label="Bottom Height" htmlFor={`plate-${plate.id}-bottomHeight`}>
                                            <InputField
                                                id={`plate-${plate.id}-bottomHeight`}
                                                type="text"
                                                inputValue={plate.bottomHeight}
                                                handleInputChange={(val) =>
                                                    updatePlate(cylinder.id, plate.id, "bottomHeight", val)
                                                }
                                                variant="narrow"
                                            />
                                        </FormGroup>

                                        <FormGroup label="X" htmlFor={`plate-${plate.id}-x`}>
                                            <InputField
                                                id={`plate-${plate.id}-x`}
                                                type="text"
                                                inputValue={plate.x}
                                                handleInputChange={(val) =>
                                                    updatePlate(cylinder.id, plate.id, "x", val)
                                                }
                                                variant="narrow"
                                            />
                                        </FormGroup>

                                        <FormGroup label="Y" htmlFor={`plate-${plate.id}-y`}>
                                            <InputField
                                                id={`plate-${plate.id}-y`}
                                                type="text"
                                                inputValue={plate.y}
                                                handleInputChange={(val) =>
                                                    updatePlate(cylinder.id, plate.id, "y", val)
                                                }
                                                variant="narrow"
                                            />
                                        </FormGroup>
                                    </FormGrid>
                                ))}
                            </section>
                        ))}

                        {/* Actieknop: verstuur job */}
                        <div>
                            <Button type="button" onClick={submitJob} label="Creeer Job" />
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default JobCreator;

