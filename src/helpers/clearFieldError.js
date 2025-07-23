/**
 * Verwijdert een foutmelding uit een errors-state als de waarde geldig is.
 * @param {Function} setErrors - De setErrors state setter.
 * @param {string} fieldPath - De key in errors (bijv. "number" of "cylinder[102].plate[1].x").
 * @param {Function} validator - Validatorfunctie die foutmelding retourneert of falsy als geldig.
 * @param {*} value - De waarde die gevalideerd wordt.
 */
export function clearFieldError(setErrors, fieldPath, validator, value) {
    if (validator && !validator(value)) {
        setErrors((prev) => {
            const updated = { ...prev };
            delete updated[fieldPath];
            return updated;
        });
    }
}
