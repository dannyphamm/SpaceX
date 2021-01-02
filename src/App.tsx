import './App.css';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import 'antd/dist/antd.css';
import Upcoming from './Upcoming';
import Past from './Past';
import rootReducer from './reducers'
import { applyMiddleware, createStore } from 'redux';
import React, { useState } from 'react';
import Home from './Home';
import Launch from './Launch';
import thunk from 'redux-thunk';
import MediaQuery from 'react-responsive'
import {CloseOutlined, MenuOutlined} from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';
function App() {
  const { Header, Content, Footer } = Layout;
  const store = createStore(rootReducer, applyMiddleware(thunk))
  store.dispatch({ type: 'ADDLAUNCHPADS' })
  store.dispatch({ type: 'ADDUPCOMING' })
  store.dispatch({ type: 'ADDPAST' })
  const [selected, setSelected] = useState<any>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <Router>
      <Header>

        <MediaQuery maxDeviceWidth={576}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <img src="https://logos-world.net/wp-content/uploads/2020/09/SpaceX-Logo.png" alt="asd" className="logo" style={{ objectFit: "cover", background: "none" }} />

            {mobileMenuOpen &&
              <CloseOutlined onClick={() => {
                setMobileMenuOpen(false)
              }}                
              style={{
                color: "white",
                alignSelf: "center",
              }}  />
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
                </Menu>
              </Sider>
            }
          </div>
        </MediaQuery>
        <MediaQuery minDeviceWidth={577}>
          <img src="https://logos-world.net/wp-content/uploads/2020/09/SpaceX-Logo.png" alt="asd" className="logo" style={{ objectFit: "cover", background: "none" }} />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={selected} >
            <Menu.Item key="4" onClick={() => setSelected(["4"])}><Link to="/" />Home</Menu.Item>
            <Menu.Item key="5" onClick={() => setSelected(["5"])}><Link to="/upcoming" />Upcoming</Menu.Item>
            <Menu.Item key="6" onClick={() => setSelected(["6"])}><Link to="/past" /> Past</Menu.Item>
          </Menu>
        </MediaQuery>
      </Header>
      <Layout className="layout">
        <Content style={{ padding: '50px 50px' }}>
          <div className="site-layout-content">
            <Switch>

              <Route path="/upcoming">
                <Upcoming value={store.getState().upcoming} valueLP={store.getState().launchpads} />
              </Route>
              <Route path="/past">
                <Past value={store.getState().past} valueLP={store.getState().launchpads} />
              </Route>
              <Route path="/launch/:id">
                <Launch />
              </Route>
              <Route path="/">
                <Home value={store.getState().upcoming} valueLP={store.getState().launchpads} />
              </Route>
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>A SpaceX launch previewer created by Danny</Footer>
      </Layout>
    </Router >
  );
}

export default App;
