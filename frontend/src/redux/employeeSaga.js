import { call, put, takeLatest } from 'redux-saga/effects';

import { getUsers } from '../services/userService';
import {
  fetchEmployeesRequest,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
} from './employeeSlice';

function* fetchEmployees() {
  try {
    const employees = yield call(getUsers);

    yield put(fetchEmployeesSuccess(employees));
  } catch (error) {
    yield put(
      fetchEmployeesFailure(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch employees',
      ),
    );
  }
}

function* employeeSaga() {
  yield takeLatest(
    fetchEmployeesRequest.type,
    fetchEmployees,
  );
}

export default employeeSaga;