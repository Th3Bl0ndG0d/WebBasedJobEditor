import React from "react";
import FormGroup from "../../components/formGroup/formGroup.jsx";
import FormGrid from "../../components/formGrid/FromGrid.jsx";
import InputField from "../../components/inputField/InputField.jsx";
import Button from "../../components/button/Button.jsx";
import ButtonGroup from "../buttonGroup/ButtonGroup.jsx";

/**
 * Component: JobPreview
 * Doel: Toont gegenereerde jobobject in read-only jobdetails en bewerkbare platevelden
 */
const JobPreview = ({ job, errors, updatePlate, submitJob, resetJob }) => {

    // Als job niet geldig is, render niets
    if (!job || !Array.isArray(job.cylinders)) return null;

    return (
        <>
            {/* === Jobmetadata: alleen-lezen velden === */}
            <section className="boxed-section">
                <h2 className="section-title boxed-section-title">JobData</h2>
                <FormGrid direction="row" theme="dark">
                    {[
                        "number",
                        "name",
                        "info",
                        "date",
                        "repeat"
                    ].map((key) => (
                        <FormGroup
                            key={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            htmlFor={`job-${key}`}
                        >
                            <InputField
                                id={`job-${key}`}
                                type={key === "repeat" ? "number" : "text"}
                                inputValue={job[key]}
                                variant="narrow"
                                disabled
                                error={errors[`job.${key}`]}
                            />
                        </FormGroup>
                    ))}
                </FormGrid>
            </section>

            {/* === Voor elke cylinder: bijbehorende platen bewerkbaar === */}
            {job.cylinders.map((cylinder) => (
                <section className="boxed-section" key={cylinder.id}>
                    <h2 className="section-title boxed-section-title">Cylinder {cylinder.id}</h2>

                    {cylinder.plates.map((plate) => (
                        <FormGrid direction="row" theme="dark" key={plate.id}>

                            {/*<h3 className="section-title boxed-section-title">Plate {plate.id}</h3>*/}

                            <FormGroup label="Plate name" >
                                <InputField
                                    id="Plate name"
                                    type="text"
                                    inputValue={plate.id}
                                    variant="narrow"
                                    disabled={true}
                                />
                            </FormGroup>


                            {/* Genereer bewerkbare invoervelden voor elke plaat-eigenschap */}
                            {["width", "topHeight", "bottomHeight", "x", "y"].map((key) => (
                                <FormGroup
                                    key={key}
                                    label={key}
                                    htmlFor={`plate-${plate.id}-${key}`}
                                >
                                    <InputField
                                        id={`plate-${plate.id}-${key}`}
                                        type="text"
                                        inputValue={plate[key]}
                                        handleInputChange={(val) =>
                                            updatePlate(cylinder.id, plate.id, key, val)
                                        }
                                        variant="narrow"
                                        error={errors[`cylinder[${cylinder.id}].plate[${plate.id}].${key}`]}
                                    />
                                </FormGroup>
                            ))}
                        </FormGrid>
                    ))}
                </section>
            ))}

            {/* === Actieknop om job te versturen === */}
                <FormGroup label=" " className="centered">
                    <ButtonGroup>
                        <Button
                            type="button"
                            onClick={resetJob}
                            label="Terug"
                        />
                        <Button
                            type="button"
                            onClick={submitJob}
                            label="Creeer Job"
                        />
                    </ButtonGroup>

                </FormGroup>
        </>
    );
};

export default JobPreview;
