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
import {fieldValidators} from "../../helpers/fieldValidators.js";
import {clearFieldError} from "../../helpers/clearFieldError.js";
// Debugger instellen
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
/**
 * Component: JobCreator
 * Doel: Faciliteert het aanmaken van een Job-object inclusief bijbehorende cylinders en platen.
 * Valideert enkel bij klik op Genereer Job of Creeer Job. Geen veld-per-veld validatie.
 */
const JobCreator = () => {
    // Auth-context voor logout-functie bij token-verval
    const { logout } = useContext(AuthContext);

    // === State Hooks ===
    // jobDetails: algemene metadata (number, name, info, repeat)
    const [jobDetails, setJobDetails] = useState({ number: "", name: "", info: "", repeat: 1250 });
    // Herhalingswaarde per cylinder
    const [repeatByCylinder, setRepeatByCylinder] = useState(1250);
    // Template voor plaatwaarden (breedte, hoogtes, posities)
    const [templatePlate, setTemplatePlate] = useState({ width: "", topHeight: "", bottomHeight: "", x: "", y: "" });
    // Aantallen
    const [numCylinders, setNumCylinders] = useState(1);
    const [platesPerCylinder, setPlatesPerCylinder] = useState(1);
    // Het volledig gegenereerde jobobject
    const [job, setJob] = useState(null);
    // Opslag voor foutmeldingen per veld
    const [errors, setErrors] = useState({});

    // === Update Functies ===
    // Wijzigt een veld in jobDetails state
    const updateJobDetails = (field, value) => {
        setJobDetails({ ...jobDetails, [field]: value });
        clearFieldError(setErrors, field, fieldValidators.job[field], value);
    };
    // Wijzigt een veld van het huidige jobobject (na Genereren)
    const updateJobField = (field, value) => {
        setJob({ ...job, [field]: value });
        clearFieldError(setErrors, field, fieldValidators.job[field], value);
    };
    // Wijzigt naam/eigenschap van een cylinder binnen job
    const updateCylinder = (id, field, value) => {
        const updated = job.cylinders.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        );
        setJob({ ...job, cylinders: updated });
        if (field === "name") {
            const key = `cylinder[${id}].${field}`;
            clearFieldError(setErrors, key, fieldValidators.cylinder[field], value);
        }
    };
    // Wijzigt een veld van een plate binnen een specifieke cylinder
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
        const key = `cylinder[${cylinderId}].plate[${plateId}].${field}`;
        clearFieldError(setErrors, key, fieldValidators.plate[field], value);
    };

    /**
     * generateJob()
     * -----------------------
     * Doel:
     * - Valideer jobDetails, repeatByCylinder en templatePlate.
     * - Toon specifieke foutmeldingen via debug.notify.
     * - Genereer en sla nieuw jobobject op.
     */
    const generateJob = () => {
        debug.notify("debug", "Genereer job gestart...");

        // 1) Valideer verplichte jobvelden
        const jobFieldErrors = {
            number: fieldValidators.job.number(jobDetails.number),
            name: fieldValidators.job.name(jobDetails.name),
        };
        setErrors(prev => ({ ...prev, ...jobFieldErrors }));

        // Verzamel fouten voor jobvelden
        const invalidJobFields = Object.entries(jobFieldErrors).filter(([, msg]) => msg);
        if (invalidJobFields.length) {
            const melding = invalidJobFields.map(([key, msg]) => `${key}: ${msg}`).join("\n");
            debug.notify("error", `Jobvelden ongeldig:\n${melding}`);
            return;
        }

        // 2) Valideer repeatByCylinder
        if (!repeatByCylinder || isNaN(repeatByCylinder)) {
            debug.notify("error", "Repeat moet een geldig getal zijn.");
            return;
        }

        // 3) Valideer templatePlate velden
        const plateErrors = Object.entries(templatePlate)
            .map(([key, val]) => [key, fieldValidators.plate[key]?.(val)])
            .filter(([, msg]) => msg);
        // 🛠 Voeg errors toe aan state
        const errorObj = {};
        plateErrors.forEach(([key, msg]) => {
            errorObj[`plate.${key}`] = msg;
        });
        setErrors(prev => ({ ...prev, ...errorObj }));
        if (plateErrors.length) {
            const melding = plateErrors.map(([key, msg]) => `plate.${key}: ${msg}`).join("\n");
            debug.notify("error", `Plaatvelden ongeldig:\n${melding}`);
            return;
        }

        // 4) Bouw cylinders en plates
        const generatedId = Date.now();
        const dataValue = new Date().toISOString();
        let plateId = 1;
        const cylinders = [];
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
            cylinders.push(Cylinder(c + 100, `Cylinder ${c}`, plates));
        }

        // 5) Stel jobobject samen
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
     * submitJob()
     * -----------------------
     * Doel:
     * - Valideer compleet jobobject incl. cylinders/plates.
     * - Toon alle validatiefouten in debug.notify.
     * - Verstuur via createFullJob naar backend.
     */
    const submitJob = async () => {
        const token = getValidTokenOrLogout(logout);
        if (!token) return;

        // Controleer of jobobject geldig is
        if (!job || !Array.isArray(job.cylinders) || job.cylinders.length === 0) {
            debug.notify("error", "Geen geldig jobobject om te versturen.");
            return;
        }

// Verzamel alle validatiefouten
        const fouten = [];

// Valideer job-velden via fieldValidators
        const jobFieldValidaties = {
            number: fieldValidators.job.number?.(job.number),
            name: fieldValidators.job.name?.(job.name),
            date: job.date?.trim() ? null : "Ontbreekt"
        };

        Object.entries(jobFieldValidaties).forEach(([key, msg]) => {
            if (msg) fouten.push(`job.${key}: ${msg}`);
        });

        // Valideer cylinders en plates
        job.cylinders.forEach((cylinder) => {
            // Cylindernaam
            const errNaam = fieldValidators.cylinder.name?.(cylinder.name);
            if (errNaam) fouten.push(`cylinder[${cylinder.id}].name: ${errNaam}`);

            // Plates
            cylinder.plates.forEach((plate) => {
                Object.entries(plate).forEach(([key, val]) => {
                    const validate = fieldValidators.plate[key];
                    if (validate) {
                        const err = validate(val);
                        if (err) fouten.push(`cylinder[${cylinder.id}].plate[${plate.id}].${key}: ${err}`);
                    }
                });
            });
        });

        if (fouten.length) {
            const melding = fouten.join("\n");

            // Zet fouten in errors state
            const errorObj = {};
            fouten.forEach((regel) => {
                const [key, ...rest] = regel.split(":");
                if (rest.length) {
                    errorObj[key.trim()] = rest.join(":").trim();
                }
            });
            setErrors(prev => ({ ...prev, ...errorObj }));

            debug.notify("error", `Validatiefouten gevonden:\n${melding}`);
            return;
        }


        // Verstuur job als alles ok is
        debug.notify("debug", "Verstuur job naar backend...");
        const response = await createFullJob(job, token);
        if (response) {
            debug.notify("succes", "Job succesvol aangemaakt!");
            CustomToast.success(
                <>
                    Job <strong>{job.name}</strong> is aangemaakt.<br />
                    <Link to="/jobOverview" className="link-button">➤ Ga naar job overzicht</Link>
                </>,
                { autoClose: 6000 }
            );
            setJob(null);
            setJobDetails({ number: "", name: "", info: "", repeat: 1250 });
        } else {
            debug.notify("error", "Fout bij het aanmaken van de job.");
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
                                        error={errors.number}
                                    />
                                </FormGroup>

                                <FormGroup label="Name" htmlFor="job-name">
                                    <InputField
                                        id="job-name"
                                        type="text"
                                        inputValue={jobDetails.name}
                                        handleInputChange={(val) => updateJobDetails("name", val)}
                                        error={errors.name}
                                    />
                                </FormGroup>

                                <FormGroup label="Info" htmlFor="job-info">
                                    <InputField
                                        id="job-info"
                                        type="text"
                                        inputValue={jobDetails.info}
                                        handleInputChange={(val) => updateJobDetails("info", val)}
                                        error={errors.info}
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
                                        error={errors.repeat}
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
                                            handleInputChange={(v) => {
                                                setTemplatePlate({ ...templatePlate, [key]: v });
                                                clearFieldError(setErrors, `plate.${key}`, fieldValidators.plate[key], v);
                                            }}
                                            variant="narrow"
                                            error={errors[`plate.${key}`]}
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
                                        // handleInputChange={(val) => updateJobField("number", val)}
                                        variant="narrow"
                                        disabled={true}

                                    />
                                </FormGroup>
                                <FormGroup label="Name" htmlFor="job-name-edit">
                                    <InputField
                                        id="job-name-edit"
                                        type="text"
                                        inputValue={job.name}
                                        // handleInputChange={(val) => updateJobField("name", val)}
                                        variant="narrow"
                                        disabled={true}
                                    />
                                </FormGroup>
                                <FormGroup label="Info" htmlFor="job-info-edit">
                                    <InputField
                                        id="job-info-edit"
                                        type="text"
                                        inputValue={job.info}
                                        // handleInputChange={(val) => updateJobField("info", val)}
                                        variant="narrow"
                                        disabled={true}
                                    />
                                </FormGroup>
                                <FormGroup label="Date" htmlFor="job-date-edit">
                                    <InputField
                                        id="job-date-edit"
                                        type="text"
                                        inputValue={job.date}
                                        handleInputChange={() => {}}
                                        variant="narrow"
                                        disabled={true}
                                    />
                                </FormGroup>
                                <FormGroup label="Repeat" htmlFor="job-repeat-edit">
                                    <InputField
                                        id="job-repeat-edit"
                                        type="number"
                                        inputValue={job.repeat}
                                        handleInputChange={() => {}}// handleInputChange={(val) => updateJobField("repeat", parseInt(val))}
                                        variant="narrow"
                                        error={errors["job.repeat"]}
                                        disabled={true}
                                    />
                                </FormGroup>
                            </FormGrid>
                        </section>

                        {/* Per cylinder: naam en platen */}
                        {job.cylinders.map((cylinder) => (
                            <section className="boxed-section" key={cylinder.id}>
                                <h2 className="section-title boxed-section-title">Cylinder {cylinder.id}</h2>

                                {/*<FormGrid direction="row" theme="dark">*/}
                                {/*    <FormGroup label="Naam" htmlFor={`cylinder-name-${cylinder.id}`}>*/}
                                {/*        <InputField*/}
                                {/*            id={`cylinder-name-${cylinder.id}`}*/}
                                {/*            type="text"*/}
                                {/*            inputValue={cylinder.name}*/}
                                {/*            handleInputChange={(val) => updateCylinder(cylinder.id, "name", val)}*/}
                                {/*            variant="narrow"*/}
                                {/*            disabled*/}
                                {/*        />*/}
                                {/*    </FormGroup>*/}
                                {/*</FormGrid>*/}

                                {cylinder.plates.map((plate) => (
                                    <FormGrid direction="row" theme="dark" key={plate.id}>
                                        <h3 className="section-title boxed-section-title">Plate {plate.id}</h3>
                                        <FormGroup label="Width" htmlFor={`plate-${plate.id}-width`}>
                                            <InputField
                                                id={`plate-${plate.id}-width`}
                                                type="text"
                                                inputValue={plate.width}
                                                handleInputChange={(val) =>
                                                    updatePlate(cylinder.id, plate.id, "width", val)
                                                }
                                                variant="narrow"
                                                error={errors[`cylinder[${cylinder.id}].plate[${plate.id}].width`]}
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
                                                error={errors[`cylinder[${cylinder.id}].plate[${plate.id}].topHeight`]}
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
                                                error={errors[`cylinder[${cylinder.id}].plate[${plate.id}].bottomHeight`]}
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
                                                error={errors[`cylinder[${cylinder.id}].plate[${plate.id}].x`]}
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
                                                error={errors[`cylinder[${cylinder.id}].plate[${plate.id}].y`]}
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

