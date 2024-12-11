import { createStore } from 'redux';

const SET_EMPLOYEES = 'SET_EMPLOYEES';
const ADD_EMPLOYEE = 'ADD_EMPLOYEE';
const EDIT_EMPLOYEE = 'EDIT_EMPLOYEE';
const DELETE_EMPLOYEE = 'DELETE_EMPLOYEE';

export const setEmployees = (employees) => ({
  type: SET_EMPLOYEES,
  payload: employees,
});

export const addEmployee = (employee) => ({
  type: ADD_EMPLOYEE,
  payload: employee,
});

export const editEmployee = (employee) => ({
  type: EDIT_EMPLOYEE,
  payload: employee,
});

export const deleteEmployee = (employeeId) => ({
  type: DELETE_EMPLOYEE,
  payload: employeeId,
});

const initialState = {
  employees: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_EMPLOYEES:
      return {
        ...state,
        employees: action.payload,
      };
    case ADD_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, action.payload],
      };
    case EDIT_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map(employee =>
          employee.id === action.payload.id ? action.payload : employee
        ),
      };
    case DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter(employee => employee.id !== action.payload),
      };
    default:
      return state;
  }
}

export const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
