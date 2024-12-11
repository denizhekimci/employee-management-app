import { setupRouter } from './router.js';
import languageManager from './i18n/language-manager.js';

const outlet = document.getElementById('outlet');

async function initApp() {
  await languageManager.changeLanguage('en');

  setupRouter(outlet);
}

initApp();