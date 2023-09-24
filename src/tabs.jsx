import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function ScoreTabs({data}) {
    const [value, setValue] = React.useState(0);
    const [tabTitles, setTabTitles] = React.useState([])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    React.useEffect(() => {
        console.log(data)
        var list = []
        for (let i = 0; i < data.length; i++) {
            var subject = data[i].subject.split(",")
            for (let j = 0; j < subject.length; j++) {
                if (!list.includes(subject[j])) {
                    list.push(subject[j])
                }
            }
        }
        console.log(list)
        setTabTitles(list)
    }, [data])

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    
                    <Tab label="Item Two" {...a11yProps(1)} />
                    <Tab label="Item Three" {...a11yProps(2)} />
                    {
                        tabTitles.map((d,i)=>{
                            return(
                                <Tab label={d} {...a11yProps(i)} />
                            )
                        })
                    }
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                Item One
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Item Three
            </CustomTabPanel>
        </Box>
    );
}