import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ChessContextProvider from "./Context/chess-context"


ReactDOM.render(
  <React.StrictMode>
    <ChessContextProvider>
        <App />

    </ChessContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

