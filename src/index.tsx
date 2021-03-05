import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { Provider } from 'react-redux'
import store from './redux/store'
const themes = {
  dark: `antd.dark.css`,
  light: `antd.css`,
};
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme="light" insertionPoint="styles-insertion-point">
        <App />
      </ThemeSwitcherProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
