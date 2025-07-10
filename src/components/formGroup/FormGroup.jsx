import './FormGroup.css';
import Label from "../label/Label.jsx";

function FormGroup({
                       label,
                       htmlFor,
                       children,
                       direction = "column",
                       theme = "light",
                       grow = true
                   }) {
    const groupClass = [
        "form-group",
        `form-group--${direction}`,
        `form-group--${theme}`,
        grow ? "form-group--grow" : "form-group--nogrow"
    ].join(" ");

    return (
        <div className={groupClass}>
            {label && <Label htmlFor={htmlFor}>{label}</Label>}
            {children}
        </div>
    );
}

export default FormGroup;
