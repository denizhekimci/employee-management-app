import { LitElement, html, css } from "lit";
import localization from '../i18n/localization';
import languageManager from '../i18n/language-manager.js';

export class NavigationMenu extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
    }

    .icon {
      font-family: 'Material Icons', sans-serif;
    }

    img {
      height: 40px;
    }

    nav {
      display: flex;
      align-items: center;
    }

    a {
      color: #FF6500;
      margin-right: 8px;
    }

    @media (max-width: 768px) {
      :host {
        flex-direction: column;
      }

      nav {
        justify-content: flex-end;
      }

      a {
        margin-bottom: 1rem;
      }
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    window.addEventListener('languageChanged', () => {
      this.requestUpdate();
    });
  }

  async toggleLang() {
    if (localization.currentLang === 'en') {
      await languageManager.changeLanguage('tr');
      dispatchEvent(new CustomEvent('languageChanged'));
    } else {
      await languageManager.changeLanguage('en');
      dispatchEvent(new CustomEvent('languageChanged'));
    }
    this.requestUpdate();
  }

  render() {
    return html`
      <img src="src/ing_logo.png" alt="Ing Logo">
      <nav>
        <a href="/">${localization.translate('employees')}</a>
        <a href="/add">${localization.translate('addNew')}</a>
        <a href="#" @click=${this.toggleLang}>${localization.currentLang === 'en' ? 'TR' : 'EN'}</a>
      </nav>
    `;
  }
}

customElements.define('navigation-menu', NavigationMenu);