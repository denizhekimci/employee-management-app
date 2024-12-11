import localization from './localization.js';

class LanguageManager {
  async changeLanguage(lang) {
    await localization.loadLanguage(lang);
    window.dispatchEvent(new CustomEvent('languageChanged'));
  }
}

const languageManager = new LanguageManager();
export default languageManager;