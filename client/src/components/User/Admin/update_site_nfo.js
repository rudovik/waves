import React, { useState, useEffect } from 'react';
import FormField from '../../utils/Form/FormField';
import {
  update,
  generateData,
  isFormValid,
  populateFields
} from '../../utils/Form/FormActions';

import { connect } from 'react-redux';

import { getSiteData, updateSiteData } from '../../../actions/site_actions';
// import { get } from 'mongoose';

const UpdateSiteNfo = (props) => {
  const [state, setState] = useState({
    formError: false,
    formSuccess: false,
    formdata: {
      address: {
        element: 'input',
        value: '',
        config: {
          label: 'Address',
          name: 'address_input',
          type: 'text',
          placeholder: 'Enter the site address'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      hours: {
        element: 'input',
        value: '',
        config: {
          label: 'Working hours',
          name: 'hours_input',
          type: 'text',
          placeholder: 'Enter the site working hours'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      phone: {
        element: 'input',
        value: '',
        config: {
          label: 'Phone number',
          name: 'phone_input',
          type: 'text',
          placeholder: 'Enter the phone number'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      email: {
        element: 'input',
        value: '',
        config: {
          label: 'Shop email',
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
        validationMessage: '',
        showlabel: true
      }
    }
  });

  useEffect(() => {
    const asyncFunc = async () => {
      try {
        const siteDataRes = await props.dispatch(getSiteData());
        const newFormData = populateFields(
          state.formdata,
          siteDataRes.payload[0]
        );
        setState({
          ...state,
          formdata: newFormData
        });
      } catch (error) {}
    };
    asyncFunc();
    // eslint-disable-next-line
  }, []);

  const updateForm = (element) => {
    const newFormdata = update(element, state.formdata, 'site_info');
    setState({
      ...state,
      formError: false,
      formdata: newFormdata
    });
  };

  const submitForm = (e) => {
    e.preventDefault();

    let dataToSubmit = generateData(state.formdata, 'site_info');
    let formIsValid = isFormValid(state.formdata, 'site_info');

    if (formIsValid) {
      props.dispatch(updateSiteData(dataToSubmit)).then(() => {
        setState({ ...state, formSuccess: true });
        setTimeout(() => {
          setState({ ...state, formSuccess: false });
        }, 2000);
      });
    } else {
      setState({ ...state, formError: true });
    }
  };

  return (
    <div>
      <form onSubmit={(event) => submitForm(event)}>
        <h1>Site info</h1>
        <FormField
          id={'address'}
          formdata={state.formdata.address}
          change={(element) => updateForm(element)}
        />

        <FormField
          id={'hours'}
          formdata={state.formdata.hours}
          change={(element) => updateForm(element)}
        />

        <FormField
          id={'phone'}
          formdata={state.formdata.phone}
          change={(element) => updateForm(element)}
        />

        <FormField
          id={'email'}
          formdata={state.formdata.email}
          change={(element) => updateForm(element)}
        />

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
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    site: state.site
  };
};

export default connect(mapStateToProps)(UpdateSiteNfo);
