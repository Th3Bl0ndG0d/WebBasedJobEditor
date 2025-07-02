import './SelectField.css';

function SelectField({
                         id,
                         value,
                         handleChange,
                         options,
                         required = false,
                         disabled = false,
                         variant = 'normal',
                     }) {
    let className;

    switch (variant) {
        case 'narrow':
            className = 'input-base input-narrow';
            break;
        case 'normal':
        default:
            className = 'input-base';
            break;
    }

    return (
        <select
            id={id}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className={className}
            required={required}
            disabled={disabled}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}

export default SelectField;
