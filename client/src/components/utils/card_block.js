import React from 'react';
import Card from './card';

const CardBlock = ({ title, list }) => {
  const renderCards = () =>
    list ? list.map((card, i) => <Card key={i} {...card} />) : null;

  return (
    <div className='card_block'>
      <div className='container'>
        {title ? <div className='title'>{title}</div> : null}

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {renderCards(list)}
        </div>
      </div>
    </div>
  );
};

export default CardBlock;
