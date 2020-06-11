import React, { useEffect, useState } from 'react';
import PageTop from '../utils/page_top';

import { frets, price } from '../utils/Form/fixed_categories';

import { connect } from 'react-redux';
import {
  getProductsToShop,
  getBrands,
  getWoods
} from '../../actions/products_actions';

import CollapseCheckbox from '../utils/collapseCheckbox';
import CollapseRadio from '../utils/collapseRadio';

import LoadMoreCards from './loadMoreCards';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faBars from '@fortawesome/fontawesome-free-solid/faBars';
import faTh from '@fortawesome/fontawesome-free-solid/faTh';

const Shop = ({ products, getBrands, getWoods, getProductsToShop }) => {
  useEffect(() => {
    getBrands();
    getWoods();
    getProductsToShop(state.skip, state.limit, state.filters);

    // eslint-disable-next-line
  }, []);

  const [state, setState] = useState({
    grid: '',
    limit: 6,
    skip: 0,
    filters: {
      brand: [],
      frets: [],
      wood: [],
      price: []
    }
  });

  const handlePrice = (value) => {
    const data = price;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }

    return array;
  };

  const handleFilters = (filters, category) => {
    const newFilters = { ...state.filters };
    newFilters[category] = filters;

    if (category === 'price') {
      let priceValues = handlePrice(filters);
      newFilters[category] = priceValues;
    }

    showFilteredResults(newFilters);

    setState({ ...state, filters: newFilters });
  };

  const showFilteredResults = async (filters) => {
    try {
      await getProductsToShop(0, state.limit, filters);

      setState({ ...state, skip: 0, filters });
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreCards = async () => {
    try {
      let skip = state.skip + state.limit;
      await getProductsToShop(
        skip,
        state.limit,
        state.filters,
        products.toShop
      );

      setState({ ...state, skip });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGrid = (type) => {
    setState({
      ...state,
      grid: type === 'bars' ? 'grid_bars' : ''
    });
  };

  return (
    <div>
      <PageTop title='Browse Products' />
      <div className='container'>
        <div className='shop_wrapper'>
          <div className='left'>
            <CollapseCheckbox
              initState={true}
              title='Brands'
              list={products.brands}
              handleFilters={(filters) => handleFilters(filters, 'brand')}
            />
            <CollapseCheckbox
              initState={false}
              title='Frets'
              list={frets}
              handleFilters={(filters) => handleFilters(filters, 'frets')}
            />
            <CollapseCheckbox
              initState={false}
              title='Wood'
              list={products.woods}
              handleFilters={(filters) => handleFilters(filters, 'wood')}
            />
            <CollapseRadio
              initState={true}
              title='Price'
              list={price}
              handleFilters={(filters) => handleFilters(filters, 'price')}
            />
          </div>

          <div className='right'>
            <div className='shop_options'>
              <div className='shop_grids clear'>
                <div
                  className={`grid_btn ${state.grid ? '' : 'active'}`}
                  onClick={() => handleGrid('grids')}
                >
                  <FontAwesomeIcon icon={faTh} />
                </div>
                <div
                  className={`grid_btn ${
                    state.grid === 'grid_bars' ? 'active' : ''
                  }`}
                  onClick={() => handleGrid('bars')}
                >
                  <FontAwesomeIcon icon={faBars} />
                </div>
              </div>
            </div>
            <div>
              <LoadMoreCards
                grid={state.grid}
                limit={state.limit}
                size={products.toShopSize}
                products={products.toShop}
                loadMore={() => loadMoreCards()}
              />
            </div>
          </div>
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

const mapDispatchToProps = (dispatch) => {
  return {
    getBrands: () => dispatch(getBrands()),
    getWoods: () => dispatch(getWoods()),
    getProductsToShop: (skip, limit, filters, previousState) =>
      dispatch(getProductsToShop(skip, limit, filters, previousState))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Shop);
