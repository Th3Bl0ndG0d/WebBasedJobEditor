import './InputField.css';

function InputField({
						type,
						inputValue,
						handleInputChange,
						placeholder,
						id,
						required = false,
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
		<>
			<input
				id={id}
				type={type}
				className={className}
				value={inputValue}
				placeholder={placeholder}
				required={required}
				onChange={(e) => handleInputChange(e.target.value)}
			/>
			{/*Je wil hier niet je resultaten ook weer gaan geven...*/}
		</>
	);
}

export default InputField;
