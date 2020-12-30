import { Button, Drawer } from 'antd'
import React, { useState } from 'react'
import RightMenu from './RightMenu'

function Navbar() {
    const [visible, setVisible] = useState<boolean>(false);
    function showDrawer() {
        setVisible(true)
    }

    function onClose() {
        setVisible(false)
    }
    return (
        <nav className="menuBar">
            <div className="logo">
                <a href="">logo</a>
            </div>
            <div className="menuCon">
                <div className="rightMenu">
                    <RightMenu />
                </div>
                <Button className="barsMenu" type="primary" onClick={showDrawer}>
                    <span className="barsBtn"></span>
                </Button>
                <Drawer
                    title="Basic Drawer"
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    visible={visible}
                >
                    <RightMenu />
                </Drawer>
            </div>
        </nav>
    )
}

export default Navbar
