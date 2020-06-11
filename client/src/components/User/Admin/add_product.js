import React, { useState, useEffect } from 'react';
import UserLayout from '../../../hoc/User';
import FormField from '../../utils/Form/FormField';
import {
  update,
  generateData,
  isFormValid,
  populateOptionFields,
  resetFields
} from '../../utils/Form/FormActions';
import FileUpload from '../../utils/Form/fileupload';

import { connect } from 'react-redux';
import {
  getBrands,
  getWoods,
  addProduct,
  clearProduct
} from '../../../actions/products_actions';

const AddProduct = ({ products, dispatch }) => {
  const [state, setState] = useState({
    formError: false,
    formSuccess: false,
    formdata: {
      name: {
        element: 'input',
        value: '',
        config: {
          label: 'Product name',
          name: 'name_input',
          type: 'text',
          placeholder: 'Enter your name'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      description: {
        element: 'textarea',
        value: '',
        config: {
          label: 'Product description',
          name: 'description_input',
          type: 'text',
          placeholder: 'Enter your description'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      price: {
        element: 'input',
        value: '',
        config: {
          label: 'Product price',
          name: 'price_input',
          type: 'number',
          placeholder: 'Enter your price'
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      brand: {
        element: 'select',
        value: '',
        config: {
          label: 'Product Brand',
          name: 'brands_input',
          options: []
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      shipping: {
        element: 'select',
        value: '',
        config: {
          label: 'Shipping',
          name: 'shipping_input',
          options: [
            { key: true, value: 'Yes' },
            { key: false, value: 'No' }
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      available: {
        element: 'select',
        value: '',
        config: {
          label: 'Available, in stock',
          name: 'available_input',
          options: [
            { key: true, value: 'Yes' },
            { key: false, value: 'No' }
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      wood: {
        element: 'select',
        value: '',
        config: {
          label: 'Wood material',
          name: 'wood_input',
          options: []
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      frets: {
        element: 'select',
        value: '',
        config: {
          label: 'Frets',
          name: 'frets_input',
          options: [
            { key: 20, value: 20 },
            { key: 21, value: 21 },
            { key: 22, value: 22 },
            { key: 24, value: 24 }
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      publish: {
        element: 'select',
        value: '',
        config: {
          label: 'Publish',
          name: 'available_input',
          options: [
            { key: true, value: 'Public' },
            { key: false, value: 'Hidden' }
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        validationMessage: '',
        showlabel: true
      },
      images: {
        value: [],
        validation: {
          required: false
        },
        valid: true,
        touched: false,
        validationMessage: '',
        showlabel: false
      }
    }
  });

  const updateFields = (newFormdata) => {
    setState({ ...state, formdata: newFormdata });
  };

  useEffect(() => {
    const formdata = state.formdata;

    const asyncFunc = async () => {
      let brands = await dispatch(getBrands());
      brands = brands.payload;

      let woods = await dispatch(getWoods());
      woods = woods.payload;

      let newFormData = populateOptionFields(formdata, brands, 'brand');
      newFormData = populateOptionFields(newFormData, woods, 'wood');

      updateFields(newFormData);
    };
    asyncFunc();
    // eslint-disable-next-line
  }, []);

  const updateForm = (element) => {
    const newFormdata = update(element, state.formdata, 'products');
    setState({
      ...state,
      formdata: newFormdata
    });
  };

  const resetFieldsHandler = () => {
    const newFormData = resetFields(state.formdata);
    setState({
      ...state,
      formSuccess: true,
      formdata: newFormData
    });

    setTimeout(() => {
      setState({ ...state, formSuccess: false });
      dispatch(clearProduct());
    }, 3000);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    let dataToSubmit = generateData(state.formdata, 'products');
    let formIsValid = isFormValid(state.formdata, 'products');

    if (formIsValid) {
      try {
        let productId = await dispatch(addProduct(dataToSubmit));
        productId = productId.payload;
        console.log(productId);

        resetFieldsHandler();
      } catch (error) {
        setState({ ...state, formError: true });
      }
    } else {
      setState({ ...state, formError: true });
    }
  };
  const imagesHandler = (images) => {
    const newFormData = {
      ...state.formdata
    };
    newFormData['images'].value = images;
    newFormData['images'].valid = true;

    setState({
      ...state,
      formdata: newFormData
    });
  };
  return (
    <UserLayout>
      <div>
        <h1>Add product</h1>
        <form /*onSubmit={(event) => submitForm(event)}*/>
          <FileUpload
            imagesHandler={(images) => imagesHandler(images)}
            reset={state.formSuccess}
          />

          <FormField
            id={'name'}
            formdata={state.formdata.name}
            change={(element) => updateForm(element)}
          />

          <FormField
            id={'description'}
            formdata={state.formdata.description}
            change={(element) => updateForm(element)}
          />
          <FormField
            id={'price'}
            formdata={state.formdata.price}
            change={(element) => updateForm(element)}
          />
          <hr />

          <FormField
            id={'brand'}
            formdata={state.formdata.brand}
            change={(element) => updateForm(element)}
          />

          <FormField
            id={'shipping'}
            formdata={state.formdata.shipping}
            change={(element) => updateForm(element)}
          />

          <FormField
            id={'available'}
            formdata={state.formdata.available}
            change={(element) => updateForm(element)}
          />

          <hr />
          <FormField
            id={'wood'}
            formdata={state.formdata.wood}
            change={(element) => updateForm(element)}
          />

          <FormField
            id={'frets'}
            formdata={state.formdata.frets}
            change={(element) => updateForm(element)}
          />

          <hr />

          <FormField
            id={'publish'}
            formdata={state.formdata.publish}
            change={(element) => updateForm(element)}
          />

          {state.formSuccess ? (
            <div className='form_success'>Success...</div>
          ) : null}

          {state.formError ? (
            <div className='error_label'>Please check your data</div>
          ) : null}
          <button
            onClick={(event) => {
              submitForm(event);
            }}
          >
            Add product
          </button>
        </form>
      </div>
    </UserLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    products: state.products
  };
};

export default connect(mapStateToProps)(AddProduct);
