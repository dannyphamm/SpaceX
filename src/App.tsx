import './App.css';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Upcoming from './Upcoming';
import Past from './Past';
import React, { useState } from 'react';
import Home from './Home';
import Test from './Test';
import Launch from './Launch';
import MediaQuery from 'react-responsive'
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';
import Gallery from './Gallery';
import { Switch as Switch1 } from 'antd';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { Provider } from 'react-redux'
import store from './redux/store'
function App() {
  const { Header, Content, Footer } = Layout;
  const [selected, setSelected] = useState<any>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState();
  const { switcher, currentTheme, status, themes } = useThemeSwitcher();

  const toggleTheme = (isChecked) => {
    setIsDarkMode(isChecked);
    switcher({ theme: isChecked ? themes.dark : themes.light });
  };

  function routes() {
    return (
      <Switch>
        <Route path="/test">
          <Test/>
        </Route>
        <Route path="/gallery">
          <Gallery/>
        </Route>
        <Route path="/upcoming">
          <Upcoming/>
        </Route>
        <Route path="/past">
          <Past/>
        </Route>
        <Route path="/launch/:id">
          <Launch/>
        </Route>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>

    )
  }

  if (status === 'loading') {
    return null;
  } else {
    return (
      <Provider store={store}>
        <Router>
          <Header>
            <MediaQuery maxDeviceWidth={576}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <img src="https://logos-world.net/wp-content/uploads/2020/09/SpaceX-Logo.png" alt="asd" className="logo" style={{ objectFit: "cover", background: "none" }} />
                <div><Switch1 checkedChildren="Dark" unCheckedChildren="Light" checked={isDarkMode} onChange={toggleTheme} /></div>
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
              <img src="https://logos-world.net/wp-content/uploads/2020/09/SpaceX-Logo.png" alt="asd" className="logo" style={{ objectFit: "cover", background: "none" }} />
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={selected} >
                <Menu.Item key="a" onClick={() => setSelected(["a"])}><Link to="/" />Home</Menu.Item>
                <Menu.Item key="b" onClick={() => setSelected(["b"])}><Link to="/upcoming" />Upcoming</Menu.Item>
                <Menu.Item key="c" onClick={() => setSelected(["c"])}><Link to="/past" /> Past</Menu.Item>
                <Menu.Item key="d" onClick={() => { setSelected(["d"]); setMobileMenuOpen(false) }}><Link to="/gallery" /> Gallery</Menu.Item>
                <Switch1 checkedChildren="Dark" unCheckedChildren="Light" checked={isDarkMode} onChange={toggleTheme} style={{ marginLeft: "1rem" }} />
              </Menu>

            </MediaQuery>
          </Header>
          <Layout className="layout">
            <MediaQuery maxDeviceWidth={576}>
              <Content>
                <div className="site-layout-content">
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
            <Footer style={{ textAlign: 'center' }}>A SpaceX launch previewer created by Danny</Footer>
          </Layout>
        </Router >
      </Provider>
    );
  }

}

export default App;
