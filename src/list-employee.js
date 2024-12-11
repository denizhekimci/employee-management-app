import { LitElement, html, css } from 'lit';
import { store, setEmployees } from './store';
import localization from '../i18n/localization';

export class ListEmployee extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center
    }

    th {
      background-color: #f4f4f4;
      font-weight: bold;
      color: #FF6500;
    }

    button {
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 4px;
      background-color: #FFFF;
      color: #FF6500;
    }

    a {
      margin-right: 10px;
      text-decoration: none;
      color: #FF6500;
    }

    a:hover {
      text-decoration: underline;
    }

    .icon {
      font-family: 'Material Icons', sans-serif;
    }

    @media (max-width: 768px) {
      table {
        font-size: 14px;
      }

      th, td {
        padding: 5px;
      }

      button {
        padding: 2px 5px;
      }
    }

    @media (max-width: 480px) {
      table {
        font-size: 12px;
      }

      th, td {
        padding: 2px;
      }

      button {
        padding: 1px 2px;
      }
    }
  `;

  static properties = {
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this._employees = [];
    this.unsubscribe = store.subscribe(() => this.requestUpdate());
  }

  get employees() {
    return store.getState().employees || [];
  }

  set employees(value) {
    store.dispatch(setEmployees(value));
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.employees.length === 0) {
      await this.fetchEmployees();
    }

    window.addEventListener('languageChanged', () => {
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  async fetchEmployees() {
    try {
      const response = await fetch('../src/employee_data.json');
      if (!response.ok) throw new Error('Failed to load employee data');
      this.employees = await response.json();
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      this.requestUpdate();
    }
  }

  changePage(page) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.requestUpdate();
    }
  }

  get paginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.employees.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.employees.length / this.itemsPerPage);
  }

  openDeleteModal(employee) {
    this.selectedEmployee = employee;
    const modal = this.shadowRoot.querySelector('delete-modal');
    if (modal) {
      modal.selectedEmployee = employee;
      modal.isOpen = true;
    }
  }

  render() {
    return html`
      <table>
        <thead>
          <tr>
            <th>${localization.translate('firstName')}</th>
            <th>${localization.translate('lastName')}</th>
            <th>${localization.translate('dateOfBirth')}</th>
            <th>${localization.translate('dateOfEmployment')}</th>
            <th>${localization.translate('phoneNumber')}</th>
            <th>${localization.translate('email')}</th>
            <th>${localization.translate('department')}</th>
            <th>${localization.translate('position')}</th>
            <th>${localization.translate('actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${this.paginatedEmployees.map(employee => html`
            <tr>
              <td>${employee.firstName}</td>
              <td>${employee.lastName}</td>
              <td>${employee.dateOfEmployment}</td>
              <td>${employee.dateOfBirth}</td>
              <td>${employee.phoneNumber}</td>
              <td>${employee.email}</td>
              <td>${employee.department}</td>
              <td>${employee.position}</td>
              <td>
                <a href="/details/${employee.id}">
                  <span class="material-icons icon">edit</span>
                </a>
                <button @click=${() => this.openDeleteModal(employee)} part="button">
                  <span class="material-icons icon">delete</span>
                </button>
              </td>
            </tr>
          `)}
        </tbody>
      </table>

      <div class="pagination">
        <button ?disabled="${this.currentPage === 1}" @click="${() => this.changePage(this.currentPage - 1)}"><span class="material-icons icon">chevron_left</span></button>
        <span>${localization.translate('page')} ${this.currentPage} of ${this.totalPages}</span>
        <button ?disabled="${this.currentPage === this.totalPages}" @click="${() => this.changePage(this.currentPage + 1)}"><span class="material-icons icon">chevron_right</span></button>
      </div>

      <delete-modal></delete-modal>
    `;
  }
}

customElements.define('list-employee', ListEmployee);