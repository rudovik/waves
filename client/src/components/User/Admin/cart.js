import React, { useState, useEffect } from 'react';
import UserLayout from '../../../hoc/User';
import UserProductBlock from '../../utils/User/product_block';

import { connect } from 'react-redux';
import {
  getCartItems,
  removeCartItem,
  onSuccessBuy
} from '../../../actions/user_actions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import faFrown from '@fortawesome/fontawesome-free-solid/faFrown';
import faSmile from '@fortawesome/fontawesome-free-solid/faSmile';

// Ac-eLEgnrdGnZ5Jw_nxzjcp5siC8NXrTSkxr-OA4jpzefywkUemTXZU_F-FDZGJwA2TUOHTKXdbmBX2_

import Paypal from '../../utils/paypal';

const UserCart = (props) => {
  const [state, setState] = useState({
    loading: true,
    total: 0,
    showTotal: false,
    showSucess: false
  });

  useEffect(() => {
    const asyncFunc = async () => {
      let cartItems = [];
      let user = props.user;

      if (user.userData.cart) {
        if (user.userData.cart.length > 0) {
          user.userData.cart.forEach((item) => {
            cartItems.push(item.id);
          });

          let cartDetail = await props.dispatch(
            getCartItems(cartItems, user.userData.cart)
          );
          cartDetail = cartDetail.payload;

          if (cartDetail.length > 0) {
            calculateTotal(cartDetail);
          }
        }
      }
    };
    asyncFunc();

    // eslint-disable-next-line
  }, []);

  const calculateTotal = (cartDetail) => {
    let total = 0;

    cartDetail.forEach((item) => {
      total += item.quantity * parseInt(item.price, 10);
    });

    setState({ ...state, showTotal: true, total });
  };

  const removeFromCart = async (id) => {
    const { payload } = await props.dispatch(removeCartItem(id));

    if (payload.cartDetail.length <= 0) {
      setState({ ...state, showTotal: false });
    } else {
      calculateTotal(payload.cartDetail);
    }
  };

  const showNoItemMessage = () => (
    <div className="cart_no_items">
      <FontAwesomeIcon icon={faFrown} />
      <div>You have not items</div>
    </div>
  );

  const transactionError = (data) => {
    console.log('Paypal error');
  };
  const transactionCanceled = (data) => {
    console.log('Transaction canceled');
  };
  const transactionSuccess = async (data) => {
    try {
      const { payload } = await props.dispatch(
        onSuccessBuy({ cartDetail: props.user.cartDetail, paymentData: data })
      );

      console.log(payload);

      if (payload.success) {
        setState({
          ...state,
          showTotal: false,
          showSuccess: true
        });
      }
    } catch (error) {}
  };

  return (
    <UserLayout>
      <h1>My cart</h1>
      <div className="user_cart">
        <UserProductBlock
          products={props.user}
          type="cart"
          removeItem={(id) => removeFromCart(id)}
        />
        {state.showTotal ? (
          <div className="user_cart_sum">
            <div>Total amount: $ {state.total}</div>
          </div>
        ) : state.showSuccess ? (
          <div className="cart_success">
            <FontAwesomeIcon icon={faSmile} />
            <div>THANK YOU</div>
            <div>YOUR ORDER IS NOW COMPLETE</div>
          </div>
        ) : (
          showNoItemMessage()
        )}
      </div>
      {state.showTotal ? (
        <div className="paypal_button_container">
          <Paypal
            toPay={state.total}
            transactionError={(data) => transactionError(data)}
            transactionCanceled={(data) => transactionCanceled(data)}
            onSuccess={(data) => transactionSuccess(data)}
          />
        </div>
      ) : null}
    </UserLayout>
  );
};

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps)(UserCart);
