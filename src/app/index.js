import React from 'react';
import ReactDOM from 'react-dom';
import App from './views/App';

const render = Component => {
  ReactDOM.render(
    <App />,
    document.getElementById('root'),
  )
}

render();
