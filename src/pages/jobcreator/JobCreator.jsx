import React, { useState } from "react";
import "./JobCreator.css";
import Cylinder from "../../constants/cylinder/cylinder";
import Plate from "../../constants/plate/plate";
import Job from "../../constants/job/job";
import Button from "../../components/button/Button.jsx";
import { createFullJob } from "../../helpers/jobAPI.js";
import { toast } from 'react-toastify';
import InputField from "../../components/inputField/InputField.jsx";

/**
 * Component: JobCreator
 * Doel: Faciliteert het aanmaken van een Job-object inclusief bijbehorende cylinders en platen.
 * Gebruikt een gestandaardiseerde invoerstructuur en valideert de essentiële invoervelden alvorens het object te genereren.
 */
const JobCreator = () => {
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
     * Verhoogt een numerieke waarde met 1
     * @param {function} setter - setState functie
     * @param {number} value - huidige waarde
     */
    const increment = (setter, value) => setter(value + 1);

    /**
     * Verlaagt een numerieke waarde met 1, maar niet onder de grenswaarde 1.
     * @param {function} setter - setState functie
     * @param {number} value - huidige waarde
     */
    const decrement = (setter, value) => setter(Math.max(1, value - 1));

    /**
     * Genereert een nieuw Job-object op basis van de huidige invoer.
     * Valideert verplichte velden en construeert het object inclusief cylinders en platen.
     */
    const generateJob = () => {
        console.log("🚀 Genereer job gestart...");

        // Minimale validatie: nummer en naam zijn verplicht
        if (!jobDetails.number || !jobDetails.name) {
            alert("Vul ten minste 'Number' en 'Name' in voor de job.");
            return;
        }

        // Validatie van het herhalingsgetal (mag niet leeg of NaN zijn)
        if (!repeatByCylinder || isNaN(repeatByCylinder)) {
            alert("Vul een geldig getal in voor 'Repeat'.");
            return;
        }

        // Validatie van sjabloonplaat-velden
        const requiredFields = ["width", "topHeight", "bottomHeight", "x", "y"];
        for (const field of requiredFields) {
            if (!templatePlate[field].trim()) {
                alert(`Veld "${field}" van de plate mag niet leeg zijn.`);
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

        console.log("✅ Job gegenereerd:", newJob);
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
        console.log("📤 Start verzenden complete job...");
        toast.info("🔄 Job wordt aangemaakt...", { autoClose: 2000 });

        const response = await createFullJob(job, toast);

        if (response) {
            toast.success("✅ Job succesvol aangemaakt!", { autoClose: 3000 });
        } else {
            toast.error("❌ Fout bij jobcreatie. Zie console.", { autoClose: false });
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
                            <div className="field-row">
                                <label>Number<input type="text" value={jobDetails.number} onChange={e => updateJobDetails("number", e.target.value)} /></label>
                                <label>Name<input type="text" value={jobDetails.name} onChange={e => updateJobDetails("name", e.target.value)} /></label>
                                <label>Info<input type="text" value={jobDetails.info} onChange={e => updateJobDetails("info", e.target.value)} /></label>
                            </div>
                        </section>

                        {/* Cylinderinstellingen incl. repeat */}
                        <section className="boxed-section">
                            <h2 className="section-title boxed-section-title">CylinderData</h2>
                            <div className="field-row">
                                <label>Repeat
                                    <input
                                        type="number"
                                        min="1"
                                        value={repeatByCylinder}
                                        onChange={e => {
                                            const val = e.target.value;
                                            const parsed = parseInt(val);
                                            setRepeatByCylinder(Number.isNaN(parsed) ? "" : parsed);
                                        }}
                                    />
                                </label>
                            </div>
                        </section>

                        {/* Plate-sjablooninstellingen */}
                        <section className="boxed-section">
                            <h2 className="section-title boxed-section-title">PlaatData</h2>
                            <div className="field-row">
                                <label>Width<input type="text" value={templatePlate.width} onChange={e => setTemplatePlate({ ...templatePlate, width: e.target.value })} /></label>
                                <label>Top Height<input type="text" value={templatePlate.topHeight} onChange={e => setTemplatePlate({ ...templatePlate, topHeight: e.target.value })} /></label>
                                <label>Bottom Height<input type="text" value={templatePlate.bottomHeight} onChange={e => setTemplatePlate({ ...templatePlate, bottomHeight: e.target.value })} /></label>
                                <label>X<input type="text" value={templatePlate.x} onChange={e => setTemplatePlate({ ...templatePlate, x: e.target.value })} /></label>
                                <label>Y<input type="text" value={templatePlate.y} onChange={e => setTemplatePlate({ ...templatePlate, y: e.target.value })} /></label>
                            </div>

                            {/* Aantal cylinders en platen per cylinder */}
                            <div className="field-row">
                                <label className="-cylinder">
                                    Aantal Cylinders
                                    <div className="increment-field-cylinder">
                                        <Button
                                            type="button"
                                            variant="square"
                                            onClick={() => decrement(setNumCylinders, numCylinders)}
                                            label="-"
                                        />
                                        <InputField
                                            type="number"
                                            inputValue={numCylinders}
                                            handleInputChange={value => setNumCylinders(parseInt(value))}
                                            className="amount"
                                        />
                                        <Button
                                            type="button"
                                            variant="square"
                                            onClick={() => increment(setNumCylinders, numCylinders)}
                                            label="+"
                                        />
                                    </div>
                                </label>

                                <label className="-plate">
                                    Aantal Platen/Cylinder
                                    <div className="increment-field-plate">
                                        <Button
                                            type="button"
                                            variant="square"
                                            onClick={() => decrement(setPlatesPerCylinder, platesPerCylinder)}
                                            label="-"
                                        />
                                        <InputField
                                            type="number"
                                            inputValue={platesPerCylinder}
                                            handleInputChange={value => setPlatesPerCylinder(parseInt(value))}
                                            className="amount"
                                        />
                                        <Button
                                            type="button"
                                            variant="square"
                                            onClick={() => increment(setPlatesPerCylinder, platesPerCylinder)}
                                            label="+"
                                        />
                                    </div>
                                </label>
                            </div>

                            <div className="field-row">
                                <Button type="button" onClick={generateJob} label="Genereer Job" />
                            </div>
                        </section>
                    </>
                )}

                {/* === Stap 2: Bewerking en verzenden van gegenereerde job === */}
                {job && Array.isArray(job.cylinders) && (
                    <>
                        {/* Bewerkbare jobvelden */}
                        <section className="boxed-section">
                            <h2 className="section-title boxed-section-title">JobData</h2>
                            <div className="field-row">
                                <label>Number<input type="text" value={job.number} onChange={e => updateJobField("number", e.target.value)} /></label>
                                <label>Name<input type="text" value={job.name} onChange={e => updateJobField("name", e.target.value)} /></label>
                                <label>Info<input type="text" value={job.info} onChange={e => updateJobField("info", e.target.value)} /></label>
                                <label>Date<input type="text" value={job.date} readOnly /></label>
                                <label>Repeat<input type="number" value={job.repeat} onChange={e => updateJobField("repeat", parseInt(e.target.value))} /></label>
                            </div>
                        </section>

                        {/* Per cylinder: naam en platen */}
                        {job.cylinders.map(c => (
                            <section className="boxed-section" key={c.id}>
                                <h2 className="section-title boxed-section-title">Cylinder {c.id}</h2>
                                <div className="field-row">
                                    <label>Naam<input type="text" value={c.name} onChange={e => updateCylinder(c.id, "name", e.target.value)} /></label>
                                </div>
                                {c.plates.map(p => (
                                    <div key={p.id} className="field-row plate-row">
                                        <span>Plate {p.id}</span>
                                        <label>Width<input type="text" value={p.width} onChange={e => updatePlate(c.id, p.id, "width", e.target.value)} /></label>
                                        <label>Top Height<input type="text" value={p.topHeight} onChange={e => updatePlate(c.id, p.id, "topHeight", e.target.value)} /></label>
                                        <label>Bottom Height<input type="text" value={p.bottomHeight} onChange={e => updatePlate(c.id, p.id, "bottomHeight", e.target.value)} /></label>
                                        <label>X<input type="text" value={p.x} onChange={e => updatePlate(c.id, p.id, "x", e.target.value)} /></label>
                                        <label>Y<input type="text" value={p.y} onChange={e => updatePlate(c.id, p.id, "y", e.target.value)} /></label>
                                    </div>
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
