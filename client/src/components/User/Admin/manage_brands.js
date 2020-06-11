import React, { useState, useEffect } from 'react';
import FormField from '../../utils/Form/FormField';
import {
  update,
  generateData,
  isFormValid,
  resetFields
} from '../../utils/Form/FormActions';

import { connect } from 'react-redux';
import { getBrands, addBrand } from '../../../actions/products_actions';

const ManageBrands = (props) => {
  const [state, setState] = useState({
    formError: false,
    formSuccess: false,
    formdata: {
      brand: {
        element: 'input',
        value: '',
        config: {
          name: 'name_input',
          type: 'text',
          placeholder: 'Enter the brand'
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
    props.dispatch(getBrands());
    // eslint-disable-next-line
  }, []);

  const showCategoryItems = () => {
    return props.products.brands
      ? props.products.brands.map((item, i) => (
          <div className='category_item' key={item._id}>
            {item.name}
          </div>
        ))
      : null;
  };

  const submitForm = async (e) => {
    e.preventDefault();

    let dataToSubmit = generateData(state.formdata, 'brands');
    let formIsValid = isFormValid(state.formdata, 'brands');
    let existingBrands = props.products.brands;

    if (formIsValid) {
      try {
        await props.dispatch(addBrand(dataToSubmit, existingBrands));
        resetFieldsHandler();
      } catch (error) {
        setState({ ...state, formError: true });
      }
    } else {
      setState({ ...state, formError: true });
    }
  };
  const updateForm = (element) => {
    const newFormdata = update(element, state.formdata, 'brands');
    setState({
      ...state,
      formdata: newFormdata
    });
  };

  const resetFieldsHandler = () => {
    const newFormData = resetFields(state.formdata, 'brands');
    setState({
      ...state,
      formSuccess: true,
      formdata: newFormData
    });
  };

  return (
    <div className='admin_category_wrapper'>
      <h1>Brands</h1>
      <div className='admin_two_column'>
        <div className='left'>
          <div className='brands_container'>{showCategoryItems()}</div>
        </div>
        <div className='right'>
          <form onSubmit={(event) => submitForm(event)}>
            <FormField
              id={'brand'}
              formdata={state.formdata.brand}
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
              Add Brand
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

export default connect(mapStateToProps)(ManageBrands);
