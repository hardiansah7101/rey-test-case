import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import { reduxReducer } from './src/redux/redux';
import Route from './src/routes';

const store = configureStore({
  reducer: reduxReducer
})

const App = () => {

  return (
    <Provider store={store}>
      <Route/>
    </Provider>
  );
};

export default App;
