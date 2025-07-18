import './InputField.css';

function InputField({
						type,
						inputValue,
						handleInputChange,
						placeholder,
						id,
						required = false,
						variant = 'normal',
						className: additionalClass = '',
					}) {
	// Map variant naar classnames
	const variantMap = {
		number: 'input-base input-number',
		narrow: 'input-base input-narrow',
		normal: 'input-base',
	};

	// Gebruik variant of fallback
	const className = `${variantMap[variant] || variantMap.normal} ${additionalClass}`.trim();

	return (
		<input
			id={id}
			type={type}
			className={className}
			value={inputValue}
			placeholder={placeholder}
			required={required}
			onChange={(e) => handleInputChange(e.target.value)}
		/>
	);
}

export default InputField;