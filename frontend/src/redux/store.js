import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import employeeReducer from './employeeSlice';
import employeeSaga from './employeeSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    employees: employeeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(employeeSaga);

export default store;