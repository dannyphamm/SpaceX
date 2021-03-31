import React, { useEffect, useState } from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { connect } from 'react-redux'
import { fetchPast } from './redux'
import { Image, Pagination } from 'antd';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { Switch } from 'antd';
function Theme() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  const { switcher, themes, currentTheme, status } = useThemeSwitcher();
  const toggleDarkMode = checked => {
    console.log(checked);
    switcher({ theme: checked ? themes.dark : themes.light });
    setIsDarkMode(checked);
  };
  
      return(<Switch checkedChildren="Dark" unCheckedChildren="Light" checked={isDarkMode} onChange={toggleDarkMode} />)
}


export default Theme