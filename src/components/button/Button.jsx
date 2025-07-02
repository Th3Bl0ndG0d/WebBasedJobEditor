import './Button.css';
// Nu kunnen de twee verschillende tyle knoppen vanuit 1 component aangeroepen worden.
function Button({ type, onClick, label, variant = "normal" }) {
	let className;
	switch (variant) {
		case "square":
			className = "button-base button-square";
			break;
		case "normal":
		default:
			className = "button-base button-normal";
			break;
	}
	return (
		<button className={className} type={type} onClick={onClick}>
			{label}
		</button>
	);
}

export default Button;