import './Label.css';

function Label({ htmlFor, children, className = '' }) {
    return (
        <label htmlFor={htmlFor} className={`label ${className}`.trim()}>
            {children}
        </label>
    );
}

export default Label;
