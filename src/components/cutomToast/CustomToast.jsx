import React from "react";
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";
import './CustomToast.css';
import {toast} from "react-toastify"; // Styling volgt

const iconMap = {
    success: <FiCheckCircle />,
    error: <FiXCircle />,
    warning: <FiAlertTriangle />,
    info: <FiInfo />,
};

function ToastContent({ type, message }) {
    return (
        <div className={`custom-toast ${type}`}>
            <div className="icon-wrapper">{iconMap[type]}</div>
            <div className="message">{message}</div>
        </div>
    );
}

// 🔔 Exporteer als object met helperfuncties
const CustomToast = {
    success: (msg) => toast(<ToastContent type="success" message={msg} />),
    error: (msg) => toast(<ToastContent type="error" message={msg} />),
    warning: (msg) => toast(<ToastContent type="warning" message={msg} />),
    info: (msg) => toast(<ToastContent type="info" message={msg} />),
};

export default CustomToast;
