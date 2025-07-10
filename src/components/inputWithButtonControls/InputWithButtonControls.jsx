import './InputWithButtonControls.css';
import Button from "../button/Button.jsx";
import InputField from "../inputField/InputField.jsx";
import FormGroup from "../formGroup/FormGroup.jsx";

function InputWithButtonControls({
                                     id,
                                     label,
                                     value,
                                     onChange,
                                     min = 0,
                                     direction = "row",      // ✅ standaard op row
                                     theme = "light",
                                     grow = false
                                 }) {
    const increment = () => onChange(Math.max(min, value + 1));
    const decrement = () => onChange(Math.max(min, value - 1));

    return (
        <FormGroup
            label={label}
            htmlFor={id}
            direction={direction}
            theme={theme}
            grow={grow}
        >
            <div className="input-button-controls">
                <Button
                    type="button"
                    variant="square"
                    onClick={decrement}
                    label="-"
                />
                <InputField
                    id={id}
                    type="number"
                    inputValue={value}
                    handleInputChange={(val) => onChange(Math.max(min, parseInt(val) || 0))}
                    variant="number"
                    className="stepper-value"
                />
                <Button
                    type="button"
                    variant="square"
                    onClick={increment}
                    label="+"
                />
            </div>
        </FormGroup>
    );
}

export default InputWithButtonControls;
