import { setupRouter } from './router.js';
import languageManager from './i18n/language-manager.js';
import localization from './i18n/localization.js';

const outlet = document.getElementById('outlet');

async function initApp() {
  await languageManager.changeLanguage(localization.currentLang);

  setupRouter(outlet);
}

initApp();