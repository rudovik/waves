import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faAngleUp from '@fortawesome/fontawesome-free-solid/faAngleUp';
import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const CollapseRadio = ({ initState, title, list, handleFilters }) => {
  const [state, setState] = useState({
    open: false,
    value: '0'
  });

  useEffect(() => {
    if (initState) {
      setState({ ...state, open: initState });
    }
    // eslint-disable-next-line
  }, []);

  const handleClick = () => {
    setState({ ...state, open: !state.open });
  };

  const handleAngle = () =>
    state.open ? (
      <FontAwesomeIcon icon={faAngleUp} className='icon' />
    ) : (
      <FontAwesomeIcon icon={faAngleDown} className='icon' />
    );

  const renderList = () =>
    list
      ? list.map((value) => (
          <FormControlLabel
            key={value._id}
            value={`${value._id}`}
            control={<Radio />}
            label={value.name}
          />
        ))
      : null;

  const handleChange = (event) => {
    handleFilters(event.target.value);
    setState({ ...state, value: event.target.value });
  };

  return (
    <div>
      <List style={{ borderBottom: '1px solid #dbdbdb' }}>
        <ListItem onClick={handleClick} style={{ padding: '10px 23px 10px 0' }}>
          <ListItemText primary={title} className='collapse_title' />
          {handleAngle()}
        </ListItem>
        <Collapse in={state.open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <RadioGroup
              aria-label='prices'
              name='prices'
              value={state.value}
              onChange={handleChange}
            >
              {renderList()}
            </RadioGroup>
          </List>
        </Collapse>
      </List>
    </div>
  );
};

export default CollapseRadio;
