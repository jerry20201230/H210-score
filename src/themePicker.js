import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ThemePicker() {

    const [theme, setTheme] = React.useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "system");

    const handleChange = (event, newTheme) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme)
        window.location.reload()
    };

    return (
        <ToggleButtonGroup
            color="primary"
            value={theme}
            exclusive
            onChange={handleChange}
        >
            <ToggleButton value="light">白色系</ToggleButton>
            <ToggleButton value="system">系統色彩</ToggleButton>
            <ToggleButton value="dark">黑色系</ToggleButton>
        </ToggleButtonGroup>
    );
}