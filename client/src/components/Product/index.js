import React, { useEffect } from 'react';
import PageTop from '../utils/page_top';

import ProdNfo from './prodNfo';
import ProdImg from './prodImg';

import {
  getProductDetail,
  clearProductDetail
} from '../../actions/products_actions';

import { connect } from 'react-redux';
import { addToCart } from '../../actions/user_actions';

const ProductPage = (props) => {
  useEffect(() => {
    const asyncFunc = async () => {
      const id = props.match.params.id;
      try {
        await props.dispatch(getProductDetail(id));
      } catch (error) {
        props.history.push('/');
      }
    };
    asyncFunc();

    return () => {
      props.dispatch(clearProductDetail());
    };
    // eslint-disable-next-line
  }, []);

  const addToCartHandler = (id) => {
    props.dispatch(addToCart(id));
  };

  return (
    <div>
      <PageTop title="Product detail" />
      <div className="container">
        {props.products.prodDetail &&
        props.products.prodDetail.name !== 'Error' ? (
          <div className="product_detail_wrapper">
            <div className="left">
              <div style={{ width: '500px' }}>
                <ProdImg detail={props.products.prodDetail} />
              </div>
            </div>
            <div className="right">
              <ProdNfo
                addToCart={(id) => addToCartHandler(id)}
                detail={props.products.prodDetail}
              />
            </div>
          </div>
        ) : (
          'Loading'
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    products: state.products
  };
};

export default connect(mapStateToProps)(ProductPage);
