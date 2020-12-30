import React from 'react'
import { Menu } from 'antd';
import { BrowserRouter as Link } from "react-router-dom";

function RightMenu() {
    const SubMenu = Menu.SubMenu;
    const MenuItemGroup = Menu.ItemGroup;
    return (
        <Menu theme="dark" mode="horizontal" >
            <Menu.Item key="Home" ><Link to="/" />Home</Menu.Item>
            <Menu.Item key="Upcoming" ><Link to="/upcoming" />Upcoming</Menu.Item>
            <Menu.Item key="Past" ><Link to="/past" /> Past</Menu.Item>
        </Menu>
    )
}

export default RightMenu
