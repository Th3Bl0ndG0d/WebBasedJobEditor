import React, { useState } from "react";
import "./JobCreator.css";
import Cylinder from "../../constants/cylinder/cylinder";
import Plate from "../../constants/plate/plate";
import Job from "../../constants/job/job";
import Button from "../../components/button/Button.jsx";


const JobCreator = () => {
    const [jobDetails, setJobDetails] = useState({
        number: "",
        name: "",
        info: "",
        repeat: 1
    });

    const [repeatByCylinder, setRepeatByCylinder] = useState(1);
    const [templatePlate, setTemplatePlate] = useState({ width: "", topHeight: "", bottomHeight: "", x: "", y: "" });
    const [numCylinders, setNumCylinders] = useState(1);
    const [platesPerCylinder, setPlatesPerCylinder] = useState(1);
    const [job, setJob] = useState(null);

    const updateJobDetails = (field, value) => {
        setJobDetails({ ...jobDetails, [field]: value });
    };

    const increment = (setter, value) => setter(value + 1);
    const decrement = (setter, value) => setter(Math.max(1, value - 1));

    const generateJob = () => {
        if (!jobDetails.number || !jobDetails.name) {
            alert("Vul ten minste 'Number' en 'Name' in voor de job.");
            return;
        }

        const requiredFields = ["width", "topHeight", "bottomHeight", "x", "y"];
        for (const field of requiredFields) {
            if (!templatePlate[field].trim()) {
                alert(`Veld "${field}" van de plate mag niet leeg zijn.`);
                return;
            }
        }

        const creationDate = new Date().toISOString();

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
            cylinders.push(Cylinder(c, repeatByCylinder.toString(), plates));
        }

        const newJob = Job(
            jobDetails.number,
            jobDetails.name,
            creationDate,
            jobDetails.info,
            repeatByCylinder,
            cylinders
        );
        setJob(newJob);
    };

    const updateJobField = (field, value) => {
        setJob({ ...job, [field]: value });
    };

    const updateCylinder = (id, field, value) => {
        const updated = job.cylinders.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        );
        setJob({ ...job, cylinders: updated });
    };

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

    const submitJob = () => {
        const json = JSON.stringify(job, null, 2);
        console.log("Job JSON:", json);

        const blob = new Blob([json], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "job.json";
        link.click();
    };

    return (
        <div className="outer-container job-editor-wrapper">
            <div className="inner-container--wide job-editor">
                <h1 className="title">JOB CREATOR</h1>

                {!job && (
                    <>
                        <section className="boxed-section">
                            <h2 className="section-title boxed-section-title">JobData</h2>
                            <div className="field-row">
                                <label>Number<input type="text" value={jobDetails.number} onChange={e => updateJobDetails("number", e.target.value)} /></label>
                                <label>Name<input type="text" value={jobDetails.name} onChange={e => updateJobDetails("name", e.target.value)} /></label>
                                <label>Info<input type="text" value={jobDetails.info} onChange={e => updateJobDetails("info", e.target.value)} /></label>
                            </div>
                        </section>

                        <section className="boxed-section">
                            <h2 className="section-title boxed-section-title">CylinderData</h2>
                            <div className="field-row">
                                <label>Repeat<input type="text" value={repeatByCylinder} onChange={e => setRepeatByCylinder(parseInt(e.target.value))} /></label>
                            </div>
                        </section>

                        <section className="boxed-section">
                            <h2 className="section-title boxed-section-title">PlaatData</h2>
                            <div className="field-row">
                                <label>Width<input type="text" value={templatePlate.width} onChange={e => setTemplatePlate({ ...templatePlate, width: e.target.value })} /></label>
                                <label>Top Height<input type="text" value={templatePlate.topHeight} onChange={e => setTemplatePlate({ ...templatePlate, topHeight: e.target.value })} /></label>
                                <label>Bottom Height<input type="text" value={templatePlate.bottomHeight} onChange={e => setTemplatePlate({ ...templatePlate, bottomHeight: e.target.value })} /></label>
                                <label>X<input type="text" value={templatePlate.x} onChange={e => setTemplatePlate({ ...templatePlate, x: e.target.value })} /></label>
                                <label>Y<input type="text" value={templatePlate.y} onChange={e => setTemplatePlate({ ...templatePlate, y: e.target.value })} /></label>
                            </div>

                            <div className="field-row">
                                <label className="-cylinder">
                                    Aantal Cylinders
                                    <div className="increment-field-cylinder">
                                        <button type="button" className="f1tv-btn" onClick={() => decrement(setNumCylinders, numCylinders)}>-</button>
                                        <input
                                            type="number"
                                            className="amount"
                                            value={numCylinders}
                                            onChange={e => setNumCylinders(parseInt(e.target.value))}
                                        />
                                        <button type="button" className="f1tv-btn" onClick={() => increment(setNumCylinders, numCylinders)}>+</button>
                                    </div>
                                </label>

                                <label className="-plate">
                                    Aantal Platen/Cylinder
                                    <div className="increment-field-plate">
                                        <button type="button" className="f1tv-btn" onClick={() => decrement(setPlatesPerCylinder, platesPerCylinder)}>-</button>
                                        <input
                                            type="number"
                                            className="amount"
                                            value={platesPerCylinder}
                                            onChange={e => setPlatesPerCylinder(parseInt(e.target.value))}
                                        />
                                        <button type="button" className="f1tv-btn" onClick={() => increment(setPlatesPerCylinder, platesPerCylinder)}>+</button>
                                    </div>
                                </label>
                            </div>

                            <div className="field-row">
                                <Button type="button" onClick={generateJob} label="Genereer Job" />
                            </div>
                        </section>
                    </>
                )}

                {job && Array.isArray(job.cylinders) && (
                    <>
                        <section className="boxed-section">
                            <h2 className="section-title boxed-section-title">JobData</h2>
                            <div className="field-row">
                                <label>Number<input type="text" value={job.number} onChange={e => updateJobField("number", e.target.value)} /></label>
                                <label>Name<input type="text" value={job.name} onChange={e => updateJobField("name", e.target.value)} /></label>
                                <label>Info<input type="text" value={job.info} onChange={e => updateJobField("info", e.target.value)} /></label>
                                <label>Date<input type="text" value={job.data} readOnly /></label>
                                <label>Repeat<input type="number" value={job.repeat} onChange={e => updateJobField("repeat", parseInt(e.target.value))} /></label>
                            </div>
                        </section>

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
