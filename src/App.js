import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import RouterComponent from './route/index';

function App() {
  return (
    <Provider store={store}>
        <RouterComponent />
    </Provider>

  );
}

export default App;
