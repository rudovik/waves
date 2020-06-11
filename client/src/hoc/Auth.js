import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { auth } from '../actions/user_actions';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function (Component, reload, adminRoute = null) {
  const AuthenticationCheck = (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const authFunc = async () => {
        const res = await props.dispatch(auth());
        if (!res.payload.isAuth) {
          if (reload) {
            props.history.push('/register_login');
          }
        } else {
          if (adminRoute && !res.payload.isAdmin) {
            props.history.push('/user/dashboard');
          } else {
            if (reload === false) {
              props.history.push('/user/dashboard');
            }
          }
        }

        setLoading(false);
      };

      authFunc();
      // eslint-disable-next-line
    }, []);

    return loading ? (
      <div className="main_loader">
        <CircularProgress style={{ color: '#2196F3' }} thickness={7} />
      </div>
    ) : (
      <Component {...props} user={props.user} />
    );
  };

  function mapStateToProps(state) {
    return {
      user: state.user
    };
  }

  return connect(mapStateToProps)(AuthenticationCheck);
}
