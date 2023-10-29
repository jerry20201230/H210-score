import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

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

export default function ScoreTabs({ data, role, href }) {
  const [value, setValue] = React.useState(0);
  const [tabTitles, setTabTitles] = React.useState([])
  const [tabType, setTabtype] = React.useState("standard")
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {

    var list = []
    for (let i = 0; i < data.length; i++) {
      var subject = data[i].subject.split(",")
      for (let j = 0; j < subject.length; j++) {
        if (!list.includes(subject[j])) {
          list.push(subject[j])
        }
      }
    }


    setTabTitles(list)
  }, [data])

  React.useEffect(() => {
    setTabtype("scrollable")
  }, [tabTitles])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}
          variant={tabType}
          scrollButtons
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}
        >
          <Tab label={"全部"} {...a11yProps(0)} />
          {
            tabTitles.map((d, i) => {
              return (
                <Tab label={d} {...a11yProps(i + 1)} />
              )
            })
          }
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <List>
          {
            data.map((d, i) => {
              return (
                <ListItem disablePadding key={d.id}>
                  <ListItemButton component={Link} to={`/score/${role === "std" ? (href === "more" ? "more" : "") : "class/"}?q=${d.id}`}>
                    <ListItemText primary={d.title} />
                  </ListItemButton>
                </ListItem>

              )
            })
          }
        </List>
      </CustomTabPanel>

      {
        tabTitles.map((d, i) => {
          return (
            tabTitles.length > 0 ?
              <CustomTabPanel value={value} index={i + 1}>
                <List>

                  {
                    (data.map((d2, i2) => {
                      return (
                        d2.subject.split(",").includes(d) ?

                          <ListItem disablePadding key={d2.id}>
                            <ListItemButton component={Link} to={`/score/${role === "std" ? (href === "more" ? "more" : "") : "class/"}?q=${d2.id}`}>
                              <ListItemText primary={d2.title} />
                            </ListItemButton>
                          </ListItem>
                          :
                          <></>
                      )
                    }))
                  }
                </List>
              </CustomTabPanel>
              : <></>
          )
        })
      }
    </Box>
  );
}