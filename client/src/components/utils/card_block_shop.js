import React from 'react';
import Card from '../utils/card';

const CardBlockShop = ({ list, grid }) => {
  const renderCards = () =>
    list
      ? list.map((card) => <Card key={card._id} {...card} grid={grid} />)
      : null;

  return (
    <div className='card_block_shop'>
      <div>
        <div>
          {list ? (
            list.length === 0 ? (
              <div className='no_result'>Sorry, no results</div>
            ) : null
          ) : null}
          {renderCards(list)}
        </div>
      </div>
    </div>
  );
};

export default CardBlockShop;
