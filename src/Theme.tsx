import React, { useEffect, useState } from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { connect } from 'react-redux'
import { fetchPast } from './redux'
import { Image, Pagination } from 'antd';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { Switch } from 'antd';
function Theme() {
    const [isDarkMode, setIsDarkMode] = useState();
    const { switcher, currentTheme, status, themes } = useThemeSwitcher();
    const toggleTheme = (isChecked) => {
        setIsDarkMode(isChecked);
        switcher({ theme: isChecked ? themes.dark : themes.light });
      };
      return(<Switch checkedChildren="Dark" unCheckedChildren="Light" checked={isDarkMode} onChange={toggleTheme} />)
}


export default Theme