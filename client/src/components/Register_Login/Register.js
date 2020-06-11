import React, { useState } from 'react';
import FormField from '../utils/Form/FormField';
import { update, generateData, isFormValid } from '../utils/Form/FormActions';
import Dialog from '@material-ui/core/Dialog';

import { connect } from 'react-redux';
import { registerUser } from '../../actions/user_actions';

const Register = ({ dispatch, history }) => {
  const [state, setState] = useState({
    formError: false,
    formSuccess: false,
    formdata: {
      name: {
        element: 'input',
        value: '',
        config: {
          name: 'name_input',
          type: 'text',
          placeholder: 'Enter your name'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
      lastname: {
        element: 'input',
        value: '',
        config: {
          name: 'lastname_input',
          type: 'text',
          placeholder: 'Enter your lastname'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: ''
      },
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
      },
      confirmPassword: {
        element: 'input',
        value: '',
        config: {
          name: 'confirm_password_input',
          type: 'password',
          placeholder: 'Confirm your password'
        },
        validation: {
          required: true,
          confirm: 'password'
        },
        valid: false,
        touched: false,
        validationMessage: ''
      }
    }
  });

  const updateForm = (element) => {
    const newFormdata = update(element, state.formdata, 'register');
    setState({
      ...state,
      formError: false,
      formdata: newFormdata
    });
  };

  const submitForm = (e) => {
    e.preventDefault();

    let dataToSubmit = generateData(state.formdata, 'login');
    let formIsValid = isFormValid(state.formdata, 'login');

    console.log(formIsValid);
    console.log(dataToSubmit);
    console.log(state.formdata);

    if (formIsValid) {
      dispatch(registerUser(dataToSubmit))
        .then((response) => {
          if (response.payload.success) {
            setState({ ...state, formError: false, formSuccess: true });
            setTimeout(() => {
              history.push('/register_login');
            }, 3000);
          } else {
            setState({ ...state, formError: true });
          }
        })
        .catch((e) => {
          setState({ ...state, formError: true });
        });
    } else {
      setState({ ...state, formError: true });
    }
  };

  return (
    <div className='page_wrapper'>
      <div className='container'>
        <div className='register_login_container'>
          <div className='left'>
            <form onSubmit={(event) => submitForm(event)}>
              <h2>Personal information</h2>
              <div className='form_block_two'>
                <div className='block'>
                  <FormField
                    id={'name'}
                    formdata={state.formdata.name}
                    change={(element) => updateForm(element)}
                  />
                </div>
                <div className='block'>
                  <FormField
                    id={'lastname'}
                    formdata={state.formdata.lastname}
                    change={(element) => updateForm(element)}
                  />
                </div>
              </div>
              <div>
                <FormField
                  id={'email'}
                  formdata={state.formdata.email}
                  change={(element) => updateForm(element)}
                />
              </div>
              <h2>Verify password</h2>
              <div className='form_block_two'>
                <div className='block'>
                  <FormField
                    id={'password'}
                    formdata={state.formdata.password}
                    change={(element) => updateForm(element)}
                  />
                </div>
                <div className='block'>
                  <FormField
                    id={'confirmPassword'}
                    formdata={state.formdata.confirmPassword}
                    change={(element) => updateForm(element)}
                  />
                </div>
              </div>

              {state.formError ? (
                <div className='error_label'>Please check your data</div>
              ) : null}
              <button
                onClick={(event) => {
                  submitForm(event);
                }}
              >
                Create an account
              </button>
            </form>
          </div>
        </div>
      </div>
      <Dialog open={state.formSuccess}>
        <div className='dialog_alert'>
          <div>Congratulations!!</div>
          <div>You will be redirected to LOGIN in a couple seconds...</div>
        </div>
      </Dialog>
    </div>
  );
};

export default connect()(Register);
