import './Button.css';
// Nu kunnen de twee verschillende tyle knoppen vanuit 1 component aangeroepen worden.
function Button({ type, onClick, label, variant = "normal" }) {
	const variantMap = {
		square: "button-base button-square",
		nav: "button-base button-navigation",
		normal: "button-base button-normal"
	};

	const className = variantMap[variant] || variantMap["normal"];
	return (
		<button className={className} type={type} onClick={onClick}>
			{label}
		</button>
	);
}

export default Button;