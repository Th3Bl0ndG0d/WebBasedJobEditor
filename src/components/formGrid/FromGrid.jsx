import React from "react";
import "./FormGrid.css";

const FormGrid = ({ children, theme = "light", spacing = "loose" }) => {
    const classes = [
        "form-grid",
        `form-grid--${theme}`,
        `form-grid--${spacing}`
    ].join(" ");

    return <div className={classes}>{children}</div>;
};

export default FormGrid;
