import './InputField.css';

function InputField({	type,
						inputValue,
						handleInputChange,
						placeholder,
						className = '',
						id,
						required = false}) {
	return (
		<>
			<input
				id={id}
				type={type}
				className={`input-standard ${className}`.trim()}//Evt verschillende types uitfilteren voor styling?
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