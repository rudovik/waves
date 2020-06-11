import React, { useState } from 'react';
import FormField from '../utils/Form/FormField';
import { update, generateData, isFormValid } from '../utils/Form/FormActions';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import loginUser from '../../actions/user_actions';

const Login = ({ dispatch, history }) => {
  const [form, setForm] = useState({
    formError: false,
    formSuccess: '',
    formdata: {
      email: {
        element: 'input',
        value: '',
        config: {
          name: 'email_input',
          type: 'email',
          placeholder: 'Enter your email'
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      password: {
        element: 'input',
        value: '',
        config: {
          name: 'password_input',
          type: 'password',
          placeholder: 'Enter your password'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      }
    }
  });

  const updateForm = (element) => {
    const newFormdata = update(element, form.formdata, 'login');
    setForm({
      ...form,
      formError: false,
      formdata: newFormdata
    });
  };

  const submitForm = (e) => {
    e.preventDefault();

    let dataToSubmit = generateData(form.formdata, 'login');
    let formIsValid = isFormValid(form.formdata, 'login');

    if (formIsValid) {
      dispatch(loginUser(dataToSubmit)).then((response) => {
        if (response.payload.loginSuccess) {
          history.push('/user/dashboard');
        } else {
          setForm({
            ...form,
            formError: true
          });
        }
      });
    } else {
      setForm({ ...form, formError: true });
    }
  };

  return (
    <div className='signin_wrapper'>
      <form onSubmit={submitForm}>
        <FormField
          id={'email'}
          formdata={form.formdata.email}
          change={(element) => updateForm(element)}
        />

        <FormField
          id={'password'}
          formdata={form.formdata.password}
          change={(element) => updateForm(element)}
        />

        {form.formError ? (
          <div className='error_label'>Please check your data</div>
        ) : null}
        <button
          onClick={(event) => {
            submitForm(event);
          }}
        >
          LOG IN
        </button>
      </form>
    </div>
  );
};

export default withRouter(connect()(Login));
