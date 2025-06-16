import './InputField.css';

function InputField({type, inputValue, handleInputChange}) {
	return (
		<>
			<input
				type={type}
				value={inputValue}
				onChange={(e) => handleInputChange(e.target.value)}
			/>
			{/*Je wil hier niet je resultaten ook weer gaan geven...*/}
		</>
	);
}

export default InputField;