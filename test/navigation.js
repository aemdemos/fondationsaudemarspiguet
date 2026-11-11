import { submitSuccess } from '../blocks/form/submit.js';
import { defaultSubmitSuccessHandler } from '../blocks/form/rules/functions.js';
import { switchToLanguage } from '../scripts/language-switcher.js';
import { getLanguageFromPath } from '../scripts/scripts.js';

window.navigationHandlers = {
  submitSuccess, defaultSubmitSuccessHandler, switchToLanguage, getLanguageFromPath,
};
