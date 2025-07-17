//Een simpele validatie setup.
export const fieldValidators = {
    job: {
        number: (value) =>
            !value || value.trim() === "" ? "Jobnummer is verplicht" : null,
        name: (value) =>
            !value || value.trim() === "" ? "Naam is verplicht" : null,
        date: (value) =>
            !value || value.trim() === "" ? "Datum is verplicht" : null,
    },

    cylinder: {
        name: (value) =>
            !value || value.trim() === "" ? "Cylindernaam is verplicht" : null,
    },

    plate: {
        width: (value) =>
            parseFloat(value) > 0 ? null : "Breedte moet groter zijn dan 0",
        topHeight: (value) =>
            parseFloat(value) >= 0 ? null : "Bovenhoogte mag niet negatief zijn",
        bottomHeight: (value) =>
            parseFloat(value) >= 0 ? null : "Onderhoogte mag niet negatief zijn",
        x: (value) =>
            value !== "" && !isNaN(value) ? null : "X moet een geldig getal zijn",
        y: (value) =>
            value !== "" && !isNaN(value) ? null : "Y moet een geldig getal zijn",
    },
};
