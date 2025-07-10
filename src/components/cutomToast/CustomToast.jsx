import React from "react";
import './CustomToast.css';
import {toast} from "react-toastify";
import {iconMap} from "../../helpers/iconMap.jsx";


//Met behulp van google, zorg ervoor dat je straks de toast kan gebruiken om ook een link weer tegeven. Leuke test om straks terug te kunnen naar job overview
/**
 * Standaard inhoud voor een toast.
 */
// function ToastContent({ type, message }) {
//     return (
//         <div className={`custom-toast ${type}`}>
//             <span className="toast-icon">{iconMap[type]?.jsx}</span>
//             <span className="toast-message">{message}</span>
//         </div>
//     );
// }

function ToastContent({ type, message }) {
    return (
        <div className={`custom-toast ${type}`}>
            <span className="toast-icon">{iconMap[type]?.jsx}</span>
            {/* Als message een string is, stop hem in een <span>; anders render direct als JSX */}
            {typeof message === 'string' ? (
                <span className="toast-message">{message}</span>
            ) : (
                <div className="toast-message">{message}</div>
            )}
        </div>
    );
}



const CustomToast = {
    success: (msg, opts = {}) => toast(<ToastContent type="success" message={msg} />, opts),
    error:   (msg, opts = {}) => toast(<ToastContent type="error" message={msg} />, opts),
    warning: (msg, opts = {}) => toast(<ToastContent type="warning" message={msg} />, opts),
    info:    (msg, opts = {}) => toast(<ToastContent type="info" message={msg} />, opts),
    debug:   (msg, opts = {}) => toast(<ToastContent type="debug" message={msg} />, opts)
};

export default CustomToast;
