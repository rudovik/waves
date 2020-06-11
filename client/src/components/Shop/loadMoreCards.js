import React from 'react';
import CardBlockShop from '../utils/card_block_shop';

const LoadMoreCards = ({ grid, products, loadMore, size, limit }) => {
  return (
    <div>
      <div>
        <CardBlockShop grid={grid} list={products} />
      </div>

      {size > 0 && size >= limit ? (
        <div className='load_more_container'>
          <span onClick={() => loadMore()}>Load More</span>
        </div>
      ) : null}
    </div>
  );
};

export default LoadMoreCards;
