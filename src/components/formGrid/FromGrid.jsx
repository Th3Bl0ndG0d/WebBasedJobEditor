// import React from "react";
// import "./FormGrid.css";
//
// const FormGrid = ({
//                       children,
//                       theme = "light",
//                       spacing = "loose",
//                       direction = "row" // ✅ Nieuw: richting meegeven
//                   }) => {
//     const classes = [
//         "form-grid",
//         `form-grid--${theme}`,
//         `form-grid--${spacing}`,
//         `form-grid--${direction}` // ✅ Richtingklasse toevoegen
//     ].join(" ");
//
//     return <div className={classes}>{children}</div>;
// };
//
// export default FormGrid;
import React from "react";
import "./FormGrid.css";

const FormGrid = ({
                      children,
                      theme = "light",
                      spacing = "loose",
                      direction = "row"
                  }) => {
    const classes = [
        "form-grid",
        `form-grid--${theme}`,
        `form-grid--${spacing}`,
        `form-grid--${direction}`
    ].join(" ");

    // Injecteer zowel direction als theme in elke child
    const enhancedChildren = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { direction, theme });
        }
        return child;
    });

    return <div className={classes}>{enhancedChildren}</div>;
};

export default FormGrid;
