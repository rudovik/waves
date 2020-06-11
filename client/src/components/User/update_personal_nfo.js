import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';

import {
  update,
  generateData,
  isFormValid,
  populateFields
} from '../utils/Form/FormActions';

import { updateUserData, clearUpdateUser } from '../../actions/user_actions';

import FormField from '../utils/Form/FormField';
// import { mapValues } from 'async';

const UpdatePersonalNfo = (props) => {
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
      }
    }
  });

  useEffect(() => {
    const newFormData = populateFields(state.formdata, props.user.userData);

    setState({
      ...state,
      formdata: newFormData
    });
    // eslint-disable-next-line
  }, []);

  const updateForm = (element) => {
    const newFormdata = update(element, state.formdata, 'update_user');
    setState({
      ...state,
      formError: false,
      formdata: newFormdata
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    let dataToSubmit = generateData(state.formdata, 'update_user');
    let formIsValid = isFormValid(state.formdata, 'update_user');

    if (formIsValid) {
      console.log(dataToSubmit);

      try {
        const profile = await props.dispatch(updateUserData(dataToSubmit));

        if (profile.payload.success === true) {
          setState({
            ...state,
            formSuccess: true
          });

          setTimeout(() => {
            props.dispatch(clearUpdateUser());
            setState({
              ...state,
              formSuccess: false
            });
          }, 2000);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setState({ ...state, formError: true });
    }
  };

  return (
    <div>
      <form onSubmit={(event) => submitForm(event)}>
        <h2>Personal information</h2>
        <div className="form_block_two">
          <div className="block">
            <FormField
              id={'name'}
              formdata={state.formdata.name}
              change={(element) => updateForm(element)}
            />
          </div>
          <div className="block">
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
        <div>
          {state.formSuccess ? (
            <div className="form_success">Success</div>
          ) : null}
          {state.formError ? (
            <div className="error_label">Please check your data</div>
          ) : null}
          <button
            onClick={(event) => {
              submitForm(event);
            }}
          >
            Update personal info
          </button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(UpdatePersonalNfo);
