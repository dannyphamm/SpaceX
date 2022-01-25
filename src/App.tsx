import './App.css';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Upcoming from './Upcoming';
import Past from './Past';
import React, { useEffect, useState } from 'react';
import Home from './Home';
import Launch from './Launch';
import MediaQuery from 'react-responsive'
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';
import Gallery from './Gallery';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { Switch as SwitchA } from 'antd';
import firebase from 'firebase/app';



function App() {
  const { Header, Content, Footer } = Layout;
  const [selected, setSelected] = useState<any>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { switcher, themes } = useThemeSwitcher();

  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const firebaseConfig = {
    apiKey: "AIzaSyAV1zFEQqRy5_Wl-GSkJrC4UNXTbXiw8EI",
    authDomain: "spacex-fc0dc.firebaseapp.com",
    projectId: "spacex-fc0dc",
    storageBucket: "spacex-fc0dc.appspot.com",
    messagingSenderId: "920508502712",
    appId: "1:920508502712:web:7e641c8e9331328e325a4d",
    measurementId: "G-C77F81TBDC"
  };
  useEffect(() => {
    signIn();
  }, [])
  const signIn = async () => {
    firebase.auth().signInAnonymously().then(() => {
      console.log('signed in');
    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    })
  };
  !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
  const toggleTheme = (isChecked) => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.dark : themes.light });
  };
  function routes() {
    return (
      <Switch>
        <Route path="/gallery">
          <Gallery />
        </Route>
        <Route path="/upcoming">
          <Upcoming />
        </Route>
        <Route path="/past">
          <Past />
        </Route>
        <Route path="/launch/:id">
          <Launch />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>

    )
  }

  return (
    <Router>
      <Header>
        <MediaQuery maxDeviceWidth={576} >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <img src="https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com/media/logo/spacex_logo_20191121063502.png" alt="SpaceX Logo" className="logo" style={{ objectFit: "contain", background: "none" }} />
            <div><SwitchA checked={isDarkMode} onChange={toggleTheme} /></div>
            {mobileMenuOpen &&
              <CloseOutlined onClick={() => {
                setMobileMenuOpen(false)
              }}
                style={{
                  color: "white",
                  alignSelf: "center",
                }} />
            }
            {!mobileMenuOpen &&
              <MenuOutlined onClick={() => {
                if (mobileMenuOpen) {
                  setMobileMenuOpen(false)
                } else {
                  setMobileMenuOpen(true)
                }
              }}
                style={{
                  color: "white",
                  alignSelf: "center",
                }} />

            }
            {mobileMenuOpen &&
              <Sider
                style={{
                  overflow: 'auto',
                  height: '100vh',
                  position: 'fixed',
                  left: 0,
                  zIndex: 100,
                  marginTop: 64,
                }}
                width={576}>
                <Menu theme="dark" mode="vertical" defaultSelectedKeys={selected} >
                  <Menu.Item key="1" onClick={() => { setSelected(["1"]); setMobileMenuOpen(false) }}><Link to="/" />Home</Menu.Item>
                  <Menu.Item key="2" onClick={() => { setSelected(["2"]); setMobileMenuOpen(false) }}><Link to="/upcoming" />Upcoming</Menu.Item>
                  <Menu.Item key="3" onClick={() => { setSelected(["3"]); setMobileMenuOpen(false) }}><Link to="/past" /> Past</Menu.Item>
                  <Menu.Item key="4" onClick={() => { setSelected(["4"]); setMobileMenuOpen(false) }}><Link to="/gallery" /> Gallery</Menu.Item>
                </Menu>
              </Sider>
            }
          </div>
        </MediaQuery>
        <MediaQuery minDeviceWidth={577}>
          <div>
            <img src="https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com/media/logo/spacex_logo_20191121063502.png" alt="SpaceX Logo" className="logo" style={{ objectFit: "contain", background: "none" }} />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={selected} style={{ float: 'right' }}>
              <div><SwitchA checked={isDarkMode} onChange={toggleTheme} /></div>
            </Menu>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={selected} >
              <Menu.Item key="a" onClick={() => setSelected(["a"])}><Link to="/" />Home</Menu.Item>
              <Menu.Item key="b" onClick={() => setSelected(["b"])}><Link to="/upcoming" />Upcoming</Menu.Item>
              <Menu.Item key="c" onClick={() => setSelected(["c"])}><Link to="/past" /> Past</Menu.Item>
              <Menu.Item key="d" onClick={() => { setSelected(["d"]); setMobileMenuOpen(false) }}><Link to="/gallery" />Gallery</Menu.Item>
            </Menu>

          </div>



        </MediaQuery>
      </Header>
      <Layout className="layout">
        <MediaQuery maxDeviceWidth={576}>
          <Content>
            <div className="site-layout-content ">

              {routes()}
            </div>
          </Content>
        </MediaQuery>
        <MediaQuery minDeviceWidth={577}>
          <Content style={{ padding: '50px 50px' }}>
            <div className="site-layout-content">
              {routes()}
            </div>
          </Content>
        </MediaQuery>
        <Footer style={{ textAlign: 'center' }}>A SpaceX launch previewer created by Danny <br />We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with Space Exploration Technologies Corp (SpaceX), or any of its subsidiaries or its affiliates. The names SpaceX as well as related names, marks, emblems and images are registered trademarks of their respective owners.</Footer>
      </Layout>
    </Router >
  );
}



export default App;
