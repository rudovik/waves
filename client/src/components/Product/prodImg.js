import React, { useState, useEffect } from 'react';
import ImageLightBox from '../utils/lightbox';

const ProdImg = ({ detail }) => {
  const [state, setState] = useState({
    lightbox: false,
    imagePos: 0,
    lightboxImages: []
  });

  useEffect(() => {
    let lightboxImages = [];
    if (detail.images.length > 0) {
      detail.images.forEach((item) => {
        lightboxImages.push(item.url);
      });

      setState({
        ...state,
        lightboxImages
      });
    }
    // eslint-disable-next-line
  }, []);

  const renderCardImage = (images) => {
    if (images.length > 0) {
      return images[0].url;
    } else {
      return `/images/image_not_available.png`;
    }
  };

  const handleLightBox = (pos) => {
    if (state.lightboxImages.length > 0) {
      setState({ ...state, lightbox: true, imagePos: pos });
    }
  };

  const handleLightBoxClose = () => {
    setState({
      ...state,
      lightbox: false
    });
  };

  const showThumbs = () =>
    state.lightboxImages.map((item, i) =>
      i > 0 ? (
        <div
          key={i}
          onClick={() => handleLightBox(i)}
          className="thumb"
          style={{ background: `url(${item}) no-repeat` }}
        ></div>
      ) : null
    );

  return (
    <div className="product_image_container">
      <div className="main_pic">
        <div
          style={{
            background: `url(${renderCardImage(detail.images)}) no-repeat`
          }}
          onClick={() => handleLightBox(0)}
        ></div>
      </div>
      <div className="main_thumbs">{showThumbs(detail)}</div>
      {state.lightbox ? (
        <ImageLightBox
          id={detail.id}
          images={state.lightboxImages}
          open={state.open}
          pos={state.imagePos}
          onclose={() => handleLightBoxClose()}
          caption={detail.brand.name}
        />
      ) : null}
    </div>
  );
};

export default ProdImg;
