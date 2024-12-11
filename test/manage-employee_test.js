import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import '../src/manage-employee.js';
import { store, addEmployee, editEmployee } from '../src/store';
import sinon from 'sinon';
import { Router } from '@vaadin/router';

suite('manage-employee', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();
  });

  teardown(() => {
    sandbox.restore();
  });

  test('is defined', () => {
    const el = document.createElement('manage-employee');
    assert.instanceOf(el, customElements.get('manage-employee'));
  });

  test('renders form for adding an employee', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    assert.shadowDom.equal(
      el,
      `
      <navigation-menu></navigation-menu>
      <h3>Add New Employee</h3>
      <form>
        <input type="text" name="firstName" placeholder="First Name" required="">
        <input type="text" name="lastName" placeholder="Last Name" required="">
        <input type="text" name="dateOfBirth" placeholder="Date of Birth" required="">
        <input type="text" name="dateOfEmployment" placeholder="Date of Employment" required="">
        <input type="text" name="phoneNumber" placeholder="Phone Number" required="">
        <input type="text" name="email" placeholder="E-mail" required="">
        <input type="text" name="department" placeholder="Department" required="">
        <input type="text" name="position" placeholder="Position" required="">
        <button type="submit">Add New Employee</button>
      </form>
    `
    );
  });

  test('renders form for editing an employee', async () => {
    const mockEmployee = {
      id: 1,
      firstName: 'Ahmet',
      lastName: 'Sourtimes',
      dateOfEmployment: '2020-01-01',
      dateOfBirth: '1990-01-01',
      phoneNumber: '555 55 55',
      email: 'ahmet.sourtimes@gmail.com',
      department: 'Tech',
      position: 'Senior',
    };
  
    const el = await fixture(html`<manage-employee></manage-employee>`);
    el.employeeId = mockEmployee.id;
    el.employee = mockEmployee;
    await el.updateComplete;
  
    const heading = el.shadowRoot.querySelector('h3');
    assert.equal(heading.textContent, 'Edit Employee', 'Form displays the edit heading when employeeId is present');
  
    const inputs = el.shadowRoot.querySelectorAll('input');
    assert.equal(inputs[0].value, 'Ahmet', 'First name is pre-filled');
    assert.equal(inputs[1].value, 'Sourtimes', 'Last name is pre-filled');
  });

  test('submits form data on add employee', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    const form = el.shadowRoot.querySelector('form');
    const addEmployeeSpy = sinon.spy(store, 'dispatch');
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  
    form.firstName.value = 'Mehmet';
    form.lastName.value = 'Sourtimes';
    form.dateOfBirth.value = '1985-05-15';
    form.dateOfEmployment.value = '2021-06-20';
    form.phoneNumber.value = '9876543210';
    form.email.value = 'ahmet.sourtimes@gmail.com';
    form.department.value = 'Tech';
    form.position.value = 'Senior';
  
    form.dispatchEvent(new Event('submit'));
  
    assert.isTrue(addEmployeeSpy.calledWith(sinon.match({ type: addEmployee.type })), 'dispatches addEmployee action');
    addEmployeeSpy.restore();
  });
  
  test('submits form data on edit employee', async () => {
    const mockEmployee = {
      id: 1,
      firstName: 'Ahmet',
      lastName: 'Sourtimes',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      phoneNumber: '1234567890',
      email: 'ahmet.sourtimes@gmail.com',
      department: 'Tech',
      position: 'Senior',
    };
  
    const el = await fixture(html`<manage-employee .employee=${mockEmployee}></manage-employee>`);
    const form = el.shadowRoot.querySelector('form');
    const editEmployeeSpy = sinon.spy(store, 'dispatch');
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  
    form.firstName.value = 'Mehmet';
    form.dispatchEvent(new Event('submit'));
  
    assert.isTrue(editEmployeeSpy.calledWith(sinon.match({ type: editEmployee.type })), 'dispatches editEmployee action');
    editEmployeeSpy.restore();
  });

  test('navigates to home on successful submission', async () => {
    const el = await fixture(html`<manage-employee></manage-employee>`);
    const routerGoSpy = sandbox.spy(Router, 'go');

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    assert.isTrue(routerGoSpy.calledWith('/'), 'Navigates to home page');
  });
});
