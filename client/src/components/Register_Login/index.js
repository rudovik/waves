import React from 'react';
import MyButton from '../utils/Button';
import Login from './Login';

const RegisterLogin = () => {
  return (
    <div className='page-wrapper'>
      <div className='container'>
        <div className='register_login_container'>
          <div className='left'>
            <h1>New Customers</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
              iusto provident, placeat praesentium deleniti magni minus
              voluptates aliquam minima totam ullam repellendus blanditiis
              suscipit pariatur dignissimos, mollitia similique nihil ea?
            </p>
            <MyButton
              type='default'
              title='Create an account'
              linkTo='/register'
              addStyles={{
                margin: '10px 0 0 0'
              }}
            />
          </div>
          <div className='right'>
            <h2>Registered customers</h2>
            <p>If you have an account please log in</p>
            <Login />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLogin;
