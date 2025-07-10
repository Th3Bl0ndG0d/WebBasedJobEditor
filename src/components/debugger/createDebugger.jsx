import {iconMap} from "../../helpers/iconMap.jsx";
import CustomToast from "../cutomToast/CustomToast.jsx";

/**
 * Maak een lokale debugger aan.
 * Ondersteunt console-output en optionele toastmeldingen.
 */
export function createDebugger({
                                 enableConsole = true,
                                 enableToast = true,
                                 toastTypes = {
                                   success: true,
                                   error: true,
                                   info: true,
                                   warning: true,
                                   debug: true
                                 }
                               } = {}) {
  return {
    /**
     * Logt en/of toont een melding op basis van type.
     * @param {string} type - Bijvoorbeeld 'success', 'error', 'debug'
     * @param {string|object} message - De hoofdboodschap
     * @param {object} options - Extra toast-opties of details
     */
    notify(type, message, options = {}) {
      const icon = iconMap[type]?.text || ''; // Tekstuele icon voor console
      const output =
          typeof message === "string"
              ? `${icon} ${message}`
              : `${icon} ${JSON.stringify(message, null, 2)}`;

      if (enableConsole) {
        const isError = type === "error";
        (isError ? console.error : console.log)(output);
      }

      if (enableToast && toastTypes[type] && CustomToast?.[type]) {
        CustomToast[type](message, options);
      }
    }
  };
}
