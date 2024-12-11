class Localization {
    constructor() {
      this.currentLang = 'en';
      this.translations = {};
    }
  
    async loadLanguage(lang) {
      try {
        const response = await fetch(`../i18n/${lang}.json`);
        this.translations[lang] = await response.json();
        this.currentLang = lang;
      } catch (error) {
        console.error('Error loading language:', error);
      }
    }

    translate(key) {
      return this.translations[this.currentLang] && this.translations[this.currentLang][key] || key;
    }
  }
  
  const localization = new Localization();
  export default localization;
  