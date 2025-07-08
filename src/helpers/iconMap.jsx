import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiTerminal } from 'react-icons/fi';

export const iconMap = {
    success: {
        jsx: <FiCheckCircle />,
        text: '✅'
    },
    error: {
        jsx: <FiXCircle />,
        text: '❌'
    },
    warning: {
        jsx: <FiAlertTriangle />,
        text: '⚠️'
    },
    info: {
        jsx: <FiInfo />,
        text: 'ℹ️'
    },
    debug: {
        jsx: <FiTerminal />,
        text: '🐞'
    }
};
