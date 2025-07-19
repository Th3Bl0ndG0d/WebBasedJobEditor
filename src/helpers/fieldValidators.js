// Factory om een numerieke validator te genereren
// Parameters:
// - field: veldnaam voor foutmelding
// - min: optioneel minimum (null = geen minimum)
// - allowZero: of 0 mag (default true)
// - max: optioneel maximum (null = geen maximum)
// - minMsg/maxMsg: eigen foutboodschappen (optioneel)
const createNumberValidator = (
    field,
    { min, allowZero = true, max, minMsg, maxMsg } = {}
) => value => {
    // Parse waarde naar getal
    const num = parseFloat(value);

    // Check op geldig getal
    if (isNaN(num)) {
        return `${field} moet een getal zijn`;
    }

    // Controleer minimumwaarde
    if (min != null && (allowZero ? num < min : num <= min)) {
        return minMsg || `${field} moet groter zijn dan ${min}`;
    }

    // Controleer maximumwaarde
    if (max != null && num > max) {
        return maxMsg || `${field} moet niet groter zijn dan ${max}`;
    }

    // Geen fouten
    return null;
};

// Simple validator voor verplichte tekstvelden
// Parameter:
// - field: veldnaam voor foutmelding
const createStringValidator = field =>
    value => (!value?.trim() ? `${field} is verplicht` : null);

// Object met alle veldvalidators per sectie
export const fieldValidators = {
    // Validatie voor job-gegevens
    job: {
        number: createStringValidator('Jobnummer'),  // verplicht veld
        name:   createStringValidator('Naam'),       // verplicht veld
        info:   () => null                           // optioneel veld, mag leeg zijn
    },

    // Validatie voor cylinder: alleen het 'repeat'-veld
    cylinder: {
        repeat: createNumberValidator('Repeat', {
            min: 220,
            max: 1250,
            minMsg: 'Repeat moet minimaal 220 zijn',
            maxMsg: 'Repeat mag niet groter zijn dan 1250'
        }),
    },

    // Validatie voor plaat-parameters
    plate: {
        width:       createNumberValidator('Breedte',     { min: 0, allowZero: false }),
        topHeight:   createNumberValidator('Bovenhoogte', { min: 0 }),
        bottomHeight:createNumberValidator('Onderhoogte',{ min: 0 }),
        x:           createNumberValidator('X'),
        y:           createNumberValidator('Y'),
    },
};
