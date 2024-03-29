import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { Provider } from 'react-redux'
import store from './redux/store'
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from '@firebase/auth';
const themes = {
  dark: `antd.dark.css`,
  light: `antd.css`,
};


const firebaseConfig = {
  apiKey: "AIzaSyAV1zFEQqRy5_Wl-GSkJrC4UNXTbXiw8EI",
  authDomain: "spacex-fc0dc.firebaseapp.com",
  projectId: "spacex-fc0dc",
  storageBucket: "spacex-fc0dc.appspot.com",
  messagingSenderId: "920508502712",
  appId: "1:920508502712:web:7e641c8e9331328e325a4d",
  measurementId: "G-C77F81TBDC"
};
getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth()
signInAnonymously(auth).then(() => {
  console.log("auth", auth.currentUser?.uid)
})

auth.onAuthStateChanged(async (user) => {
 
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <ThemeSwitcherProvider
            insertionPoint={'inject-styles-here'}
            themeMap={themes}
            defaultTheme={'dark'}
          >{user && <App />}
          </ThemeSwitcherProvider>
        </Provider>
      </React.StrictMode>,
      document.getElementById('root')
    );
})



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
