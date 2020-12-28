import './App.css';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import 'antd/dist/antd.css';
import Upcoming from './Upcoming';
import Past from './Past';
import rootReducer from './reducers'
import { createStore } from 'redux';
import React, { useState } from 'react';
import Home from './Home';


function App() {
  const { Header, Content, Footer } = Layout;
  const store = createStore(rootReducer)
  store.dispatch({ type: 'ADDLAUNCHPADS' })
  store.dispatch({ type: 'ADDUPCOMING' })
  store.dispatch({ type: 'ADDPAST' })
  const [selected, setSelected] = useState<any>([]);
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={selected}>
            <Menu.Item key="1" onClick={() => setSelected(["1"])} ><Link to="/" />Home</Menu.Item>
            <Menu.Item key="2" onClick={() => setSelected(["2"])} ><Link to="upcoming" />Upcoming</Menu.Item>
            <Menu.Item key="3" onClick={() => setSelected(["3"])}><Link to="past" /> Past</Menu.Item>
            <Menu.Item key="4" onClick={() => setSelected(["4"])}>launchpads</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '50px 50px' }}>
          <div className="site-layout-content">
            <Switch>

              <Route path="/upcoming">
                <Upcoming value={store.getState().upcoming} valueLP={store.getState().launchpads} />
              </Route>
              <Route path="/past">
                <Past value={store.getState().past} valueLP={store.getState().launchpads} />
              </Route>
              <Route path="/">
                <Home value={store.getState().upcoming} valueLP={store.getState().launchpads} />
              </Route>
            </Switch>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>

    </Router>
  );
}

export default App;
