import React from 'react';
import MyButton from './Button';

import { connect } from 'react-redux';
import { addToCart } from '../../actions/user_actions';

const Card = ({
  grid,
  images,
  brand,
  name,
  price,
  _id,
  description,
  user,
  dispatch
}) => {
  const renderCardImage = (images) => {
    if (images.length > 0) {
      return images[0].url;
    } else {
      return '/images/image_not_available.png';
    }
  };

  return (
    <div className={`card_item_wrapper ${grid}`}>
      <div
        className="image"
        style={{ background: `url(${renderCardImage(images)}) no-repeat` }}
      ></div>
      <div className="action_container">
        <div className="tags">
          <div className="brand">{brand.name}</div>
          <div className="name">{name}</div>
          <div className="name">${price}</div>
        </div>

        {grid ? (
          <div className="description">
            <p>{description}</p>
          </div>
        ) : null}
        <div className="actions">
          <div className="button_wrapp">
            <MyButton
              type="default"
              altClass="card_link"
              title="View Product"
              linkTo={`/product_detail/${_id}`}
            />
          </div>
          <div className="button_wrapp">
            <MyButton
              type="bag_link"
              runAction={() => {
                user.userData.isAuth
                  ? dispatch(addToCart(_id))
                  : console.log('You need to log in');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Card);
