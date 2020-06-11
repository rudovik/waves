import React, { useState, useEffect } from 'react';

import FormField from '../../utils/Form/FormField';
import {
  update,
  generateData,
  isFormValid,
  resetFields
} from '../../utils/Form/FormActions';

import { connect } from 'react-redux';
import { getWoods, addWood } from '../../../actions/products_actions';

const ManageWoods = (props) => {
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
          placeholder: 'Enter the wood'
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

  useEffect(() => {
    props.dispatch(getWoods());
    // eslint-disable-next-line
  }, []);

  const showCategoryItems = () => {
    return props.products.woods
      ? props.products.woods.map((item, i) => (
          <div className='category_item' key={item._id}>
            {item.name}
          </div>
        ))
      : null;
  };

  const updateForm = (element) => {
    const newFormdata = update(element, state.formdata, 'woods');
    setState({
      ...state,
      formdata: newFormdata
    });
  };

  const resetFieldsHandler = () => {
    const newFormData = resetFields(state.formdata, 'woods');
    setState({
      ...state,
      formSuccess: true,
      formdata: newFormData
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    let dataToSubmit = generateData(state.formdata, 'woods');
    let formIsValid = isFormValid(state.formdata, 'woods');
    let existingWoods = props.products.woods;

    if (formIsValid) {
      try {
        await props.dispatch(addWood(dataToSubmit, existingWoods));
        resetFieldsHandler();
      } catch (error) {
        setState({ ...state, formError: true });
      }
    } else {
      setState({ ...state, formError: true });
    }
  };

  return (
    <div className='admin_category_wrapper'>
      <h1>Woods</h1>
      <div className='admin_two_column'>
        <div className='left'>
          <div className='brands_container'>{showCategoryItems()}</div>
        </div>
        <div className='right'>
          <form onSubmit={(event) => submitForm(event)}>
            <FormField
              id={'name'}
              formdata={state.formdata.name}
              change={(element) => updateForm(element)}
            />

            {state.formError ? (
              <div className='error_label'>Please check your data</div>
            ) : null}
            <button
              onClick={(event) => {
                submitForm(event);
              }}
            >
              Add wood
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    products: state.products
  };
};

export default connect(mapStateToProps)(ManageWoods);
