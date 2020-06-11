import React, { useEffect } from 'react';
import HomeSlider from './home_slider';
import HomePromotion from './home_promotion';
import CardBlock from '../utils/card_block';

import { connect } from 'react-redux';
import {
  getProductsBySell,
  getProductsByArrival
} from '../../actions/products_actions';

const Home = ({ dispatch, products }) => {
  useEffect(() => {
    dispatch(getProductsBySell());
    dispatch(getProductsByArrival());
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <HomeSlider />
      <CardBlock list={products.bySell} title='Best Selling guitars' />
      <HomePromotion />
      <CardBlock list={products.byArrival} title='New arrivals' />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    products: state.products
  };
};

export default connect(mapStateToProps)(Home);
