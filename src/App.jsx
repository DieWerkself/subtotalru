import React from 'react';
import List from './components/List';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <List />
    </Provider>
  );
};

export default App;
