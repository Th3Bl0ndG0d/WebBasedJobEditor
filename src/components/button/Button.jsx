import './Button.css';

function Button({ type, onClick, label }) {
	return (
		<button className="button-red" type={type} onClick={onClick}>
			{label}
		</button>
	);
}

export default Button;