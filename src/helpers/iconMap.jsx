import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiTerminal } from 'react-icons/fi';

export const iconMap = {
    success: {
        jsx: <div className="icon-wrapper"><FiCheckCircle /></div>,
        text: '✅'
    },
    error: {
        jsx: <div className="icon-wrapper"><FiXCircle /></div>,
        text: '❌'
    },
    warning: {
        jsx: <div className="icon-wrapper"><FiAlertTriangle /></div>,
        text: '⚠️'
    },
    info: {
        jsx: <div className="icon-wrapper"><FiInfo /></div>,
        text: 'ℹ️'
    },
    debug: {
        jsx: <div className="icon-wrapper"><FiTerminal /></div>,
        text: '🐞'
    }
};
