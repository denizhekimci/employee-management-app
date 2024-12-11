import { LitElement, html, css } from 'lit';
import { store, deleteEmployee } from './store';
import localization from '../i18n/localization';

export class DeleteModal extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    selectedEmployee: { type: Object }
  };

  static styles = css`
    .modal {
      display: flex;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.4);
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background-color: #fff;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 30%;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
      text-align: center;
    }
    .modal-content h2 {
      margin: 0 0 15px;
    }
    .modal-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    .cancel-btn {
      background-color: #ccc;
      color: #333;
    }
    .confirm-btn {
      background-color: #FF6500;
      color: white;
    }
  `;

  constructor() {
    super();
    this.isOpen = false;
    this.selectedEmployee = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    window.addEventListener('languageChanged', () => {
      this.requestUpdate();
    });
  }

  closeModal() {
    this.isOpen = false;
    this.dispatchEvent(new Event('modal-closed'));
    this.requestUpdate();
  }

  confirmDelete() {
    if (this.selectedEmployee) {
      store.dispatch(deleteEmployee(this.selectedEmployee.id));
      this.selectedEmployee = null;
      this.closeModal();
    }
  }

  render() {
    if (!this.employee && !this.isOpen) return html``;

    return html`
      <div class="modal">
        <div class="modal-content">
          <h2>${localization.translate('deleteEmployee')}</h2>
          <p>${localization.translate('confirmDelete')} <strong>${this.selectedEmployee.firstName} ${this.selectedEmployee.lastName}</strong>?</p>
          <div class="modal-buttons">
            <button class="cancel-btn" @click="${this.closeModal}">${localization.translate('cancel')}</button>
            <button class="confirm-btn" @click="${this.confirmDelete}">${localization.translate('delete')}</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('delete-modal', DeleteModal);