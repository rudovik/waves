import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faAngleUp from '@fortawesome/fontawesome-free-solid/faAngleUp';
import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';

const CollapseCheckbox = ({ initState, title, list, handleFilters }) => {
  const [state, setState] = useState({ open: false, checked: [] });

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
          <ListItem key={value._id} style={{ padding: '10px 0' }}>
            <ListItemText primary={value.name} />
            <ListItemSecondaryAction>
              <Checkbox
                color='primary'
                onChange={() => handleToggle(value._id)}
                checked={state.checked.indexOf(value._id) !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))
      : null;

  const handleToggle = (value) => {
    const { checked } = state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    handleFilters(newChecked);

    setState({ ...state, checked: newChecked });
  };

  return (
    <div className='collapse_items_wrapper'>
      <List style={{ borderBottom: '1px solid #dbdbdb' }}>
        <ListItem onClick={handleClick} style={{ padding: '10px 23px 10px 0' }}>
          <ListItemText primary={title} className='collapse_title' />
          {handleAngle()}
        </ListItem>
        <Collapse in={state.open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            {renderList()}
          </List>
        </Collapse>
      </List>
    </div>
  );
};

export default CollapseCheckbox;
