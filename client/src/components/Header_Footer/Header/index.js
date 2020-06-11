import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { logoutUser } from '../../../actions/user_actions';

const Header = ({ user, dispatch, history }) => {
  // eslint-disable-next-line
  const [state, setState] = useState({
    page: [
      {
        name: 'Home',
        linkTo: '/',
        public: true
      },
      {
        name: 'Guitars',
        linkTo: '/shop',
        public: true
      }
    ],
    user: [
      {
        name: 'My Cart',
        linkTo: '/user/cart',
        public: false
      },
      {
        name: 'My Account',
        linkTo: '/user/dashboard',
        public: false
      },
      {
        name: 'Log in',
        linkTo: '/register_login',
        public: true,
        hideIfLogIn: true
      },
      {
        name: 'Log out',
        linkTo: '/user/logout',
        public: false
      }
    ]
  });

  const logoutHandler = () => {
    dispatch(logoutUser()).then((response) => {
      if (response.payload.success) {
        history.push('/');
      }
    });
  };

  const defaultLink = (item, i) =>
    item.name === 'Log out' ? (
      <div className='log_out_link' key={i} onClick={() => logoutHandler()}>
        {item.name}
      </div>
    ) : (
      <Link to={item.linkTo} key={i}>
        {item.name}
      </Link>
    );

  const cartLink = (item, i) => {
    const cart = user.userData.cart;
    return (
      <div className='cart_link' key={i}>
        <span>{cart ? cart.length : 0}</span>
        <Link to={item.linkTo}>{item.name}</Link>
      </div>
    );
  };

  const showLinks = (type) => {
    let list = [];
    let isAuth = user.userData && user.userData.isAuth;

    if (isAuth) {
      type.forEach((item) => {
        if (!item.hideIfLogIn) {
          list.push(item);
        }
      });
    } else {
      type.forEach((item) => {
        if (item.public === true) {
          list.push(item);
        }
      });
    }

    return list.map((item, i) => {
      if (item.name !== 'My Cart') {
        return defaultLink(item, i);
      } else {
        return cartLink(item, i);
      }
    });
  };

  return (
    <header className='bck_b_light'>
      <div className='container'>
        <div className='left'>
          <div className='logo'>Rudo</div>
        </div>
        <div className='right'>
          <div className='top'>{showLinks(state.user)}</div>
          <div className='bottom'>{showLinks(state.page)}</div>
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default withRouter(connect(mapStateToProps)(Header));
