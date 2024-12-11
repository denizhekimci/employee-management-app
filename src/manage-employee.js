import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { store, addEmployee, editEmployee } from './store';
import { v4 as uuidv4 } from 'uuid';
import localization from '../i18n/localization';

export class ManageEmployee extends LitElement {
  static styles = css`

.form-container {
    max-width: 800px;
    margin: 8px auto;
    padding: 8px 16px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .form-header {
    margin-bottom: 16px;
  }

  .form-header h3 {
    font-weight: bold;
    font-size: 18px;
    color: #333;
    text-align: center;
  }

  input[type="text"], select {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

input[type="text"] {
  width: calc(100% - 20px);
}

label {
  display: block;
  margin-bottom: 10px;
}

button[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .form-container {
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .form-container {
    max-width: 100%;
    padding: 10px;
  }
}
`;

  static properties = {
    employeeId: { type: String },
    employee: { type: Object },
  };

  constructor() {
    super();
    this.employeeId = null;
    this.employee = null;
  }

  onBeforeEnter(location) {
    if (location.params.id) {
      this.employeeId = location.params.id;
      this.employees = store.getState().employees;
      this.employee = this.employees.find((employee) => employee.id === this.employeeId);
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    window.addEventListener('languageChanged', () => {
      this.requestUpdate();
    });
  }

  async addEmployee(event) {
    event.preventDefault();
    const form = event.target;
    const newEmployee = {
      id: uuidv4(),
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      dateOfBirth: form.dateOfBirth.value,
      dateOfEmployment: form.dateOfEmployment.value,
      phoneNumber: form.phoneNumber.value,
      email: form.email.value,
      department: form.department.value,
      position: form.position.value,
    };

    store.dispatch(addEmployee(newEmployee));
    Router.go('/');
  }

  async editEmployee(event) {
    event.preventDefault();
    const form = event.target;

    const newEmployee = {
      id: this.employee.id,
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      dateOfBirth: form.dateOfBirth.value,
      dateOfEmployment: form.dateOfEmployment.value,
      phoneNumber: form.phoneNumber.value,
      email: form.email.value,
      department: form.department.value,
      position: form.position.value,
    };

    store.dispatch(editEmployee(newEmployee));
    Router.go('/');
  }

  render() {
    return html`
    <div class="form-container">
      <div class="form-header">
        <h3>${this.employeeId ? localization.translate('editEmployee') : localization.translate('addNewEmployee')}</h3>
      </div>
      <form @submit="${this.employeeId ? this.editEmployee : this.addEmployee}">
        <input type="text" name="firstName" .value="${this.employeeId ? this.employee.firstName : null}" placeholder="First Name" required />
        <input type="text" name="lastName" .value="${this.employeeId ? this.employee.lastName : null}" placeholder="Last Name" required />
        <input type="text" name="dateOfBirth" .value="${this.employeeId ? this.employee.dateOfBirth : ''}" placeholder="Date of Birth" required />
        <input type="text" name="dateOfEmployment" .value="${this.employeeId ? this.employee.dateOfEmployment : ''}" placeholder="Date of Employment" required />
        <input type="text" name="phoneNumber" .value="${this.employeeId ? this.employee.phoneNumber : ''}" placeholder="Phone Number" required />
        <input type="text" name="email" .value="${this.employeeId ? this.employee.email : ''}" placeholder="E-mail" required />
        <label for="department">Department:</label>
        <select id="department" name="department">
          <option value="Tech" ?selected="${this.employeeId && this.employee.department === 'Tech'}">Tech</option>
          <option value="Analytics" ?selected="${this.employeeId && this.employee.department === 'Analytics'}">Analytics</option>
        </select>
        <label for="position">Position:</label>
        <select id="position" name="position">
          <option value="Junior" ?selected="${this.employeeId && this.employee.position === 'Junior'}">Junior</option>
          <option value="Medior" ?selected="${this.employeeId && this.employee.position === 'Medior'}">Medior</option>
          <option value="Senior" ?selected="${this.employeeId && this.employee.position === 'Senior'}">Senior</option>
        </select>
        <button type="submit">${this.employeeId ? localization.translate('editEmployee') : localization.translate('addNewEmployee')}</button>
      </form>
    </div>
    `;
  }
}

customElements.define('manage-employee', ManageEmployee);
