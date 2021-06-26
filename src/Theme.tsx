import { useState } from 'react'
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { Switch } from 'antd';
function Theme() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { switcher, themes} = useThemeSwitcher();
  const toggleDarkMode = checked => {
    switcher({ theme: checked ? themes.dark : themes.light });
    setIsDarkMode(checked);
  };
  
      return(<Switch checkedChildren="Dark" unCheckedChildren="Light" checked={isDarkMode} onChange={toggleDarkMode} />)
}


export default Theme