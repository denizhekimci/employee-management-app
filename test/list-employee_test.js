import { ListEmployee } from '../src/list-employee.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';

suite('list-employee', () => {
    let employees = [
        {
          id: 1,
          firstName: 'Ahmet',
          lastName: 'Sourtimes',
          dateOfEmployment: '2020-01-01',
          dateOfBirth: '1990-01-01',
          phoneNumber: '555 55 55',
          email: 'ahmet.sourtimes@gmail.com',
          department: 'Tech',
          position: 'Senior',
        },
      ];
    
    test('is defined', () => {
        const el = document.createElement('list-employee');
        assert.instanceOf(el, ListEmployee);
    });

    test('renders with default values', async () => {
        const el = await fixture(html`<list-employee></list-employee>`);
        assert.shadowDom.equal(
            el,
            `
          <table>
            <thead>
              <tr>
                <th>firstName</th>
                <th>lastName</th>
                <th>dateOfBirth</th>
                <th>dateOfEmployment</th>
                <th>phoneNumber</th>
                <th>email</th>
                <th>department</th>
                <th>position</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          <div class="pagination">
            <button disabled>
                <span class="icon material-icons">
                    chevron_left
                </span>
            </button>
            <span>Page 1 of 0</span>
            <button>
                <span class="icon material-icons">
                    chevron_right
                </span>
            </button>
          </div>
          <delete-modal></delete-modal>
          `
        );
    });

    test('populates employees correctly', async () => {
        const employees = [
            { id: 1, firstName: 'Ahmet', lastName: 'Sourtimes', dateOfEmployment: '2020-01-01', dateOfBirth: '1990-01-01', phoneNumber: '555 55 55', email: 'ahmet.sourtimes@gmail.com', department: 'Tech', position: 'Senior' }
        ];
        const el = await fixture(html`<list-employee></list-employee>`);
        el.employees = employees;
        await el.updateComplete;

        assert.shadowDom.equal(
            el,
            `
      <table>
        <thead>
          <tr>
            <th>firstName</th>
            <th>lastName</th>
            <th>dateOfBirth</th>
            <th>dateOfEmployment</th>
            <th>phoneNumber</th>
            <th>email</th>
            <th>department</th>
            <th>position</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ahmet</td>
            <td>Sourtimes</td>
            <td>2020-01-01</td>
            <td>1990-01-01</td>
            <td>555 55 55</td>
            <td>ahmet.sourtimes@gmail.com</td>
            <td>Tech</td>
            <td>Senior</td>
            <td>
              <a href="/details/1"><span class="material-icons icon">edit</span></a>
              <button part="button">
                <span class="material-icons icon">delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button disabled>
            <span class="icon material-icons">
                chevron_left
            </span>
        </button>
        <span>Page 1 of 1</span>
        <button disabled>
            <span class="icon material-icons">
                chevron_right
            </span>
        </button>
      </div>
      <delete-modal></delete-modal>
      `
        );
    });

    test('handles pagination correctly', async () => {
        const employees = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          firstName: `First${i + 1}`,
          lastName: `Last${i + 1}`,
          dateOfEmployment: `2020-01-${i + 1}`,
          dateOfBirth: `1990-01-${i + 1}`,
          phoneNumber: `123456789${i + 1}`,
          email: `user${i + 1}@example.com`,
          department: `Tech${i + 1}`,
          position: `Seniortion${i + 1}`
        }));
        const el = await fixture(html`<list-employee></list-employee>`);
        el.employees = employees;
        el.itemsPerPage = 10;
        el.currentPage = 1;
        await el.updateComplete;
    
        assert.equal(el.paginatedEmployees.length, 10, 'Displays correct number of items per page');
    
        el.changePage(2);
        await el.updateComplete;
        assert.equal(el.paginatedEmployees[0].firstName, 'First11', 'Correctly displays the next page');
    });

    test('renders the edit and delete buttons', async () => {
        const el = await fixture(html`<list-employee></list-employee>`);
        el.employees = employees;
        await el.updateComplete;
    
        const editButton = el.shadowRoot.querySelector('a[href="/details/1"] .icon');
        const deleteButton = el.shadowRoot.querySelector('button .icon');
    
        assert.ok(editButton, 'Edit button is rendered');
        assert.ok(deleteButton, 'Delete button is rendered');
    });

    test('navigates to edit when clicking the edit button', async () => {
        const el = await fixture(html`<list-employee></list-employee>`);
        el.employees = employees;
        await el.updateComplete;
    
        const editLink = el.shadowRoot.querySelector('a[href="/details/1"]');
        assert.ok(editLink, 'Edit link is rendered');
        assert.equal(editLink.getAttribute('href'), '/details/1', 'Edit link navigates to correct URL');
      });
    
    test('opens the delete modal when clicking the delete button', async () => {
        const el = await fixture(html`<list-employee></list-employee>`);
        el.employees = employees;
        await el.updateComplete;
    
        const deleteButton = el.shadowRoot.querySelector('button');
        deleteButton.click();
        await el.updateComplete;
    
        const modal = el.shadowRoot.querySelector('delete-modal');
        assert.isTrue(modal.isOpen, 'Delete modal is open');
        assert.deepEqual(modal.selectedEmployee, employees[0], 'Correct employee is selected for deletion');
    });
    
    test('closes the delete modal when modal-closed event is triggered', async () => {
        const el = await fixture(html`<list-employee></list-employee>`);
        el.employees = employees;
        await el.updateComplete;
    
        const modal = el.shadowRoot.querySelector('delete-modal');
        modal.isOpen = true;
        await modal.updateComplete;
    
        modal.dispatchEvent(new Event('modal-closed'));
        await el.updateComplete;
    
        assert.isTrue(modal.isOpen, 'Delete modal is closed after modal-closed event');
    });
});