import React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';

const ImageLightbox = (props) => {
  // return (
  //   <LightBox
  //     currentImage={state.currentImage}
  //     views={state.images}
  //     isOpen={state.lightboxIsOpen}
  //     onClickPrev={() => this.gotoPrevious()}
  //     onClickNext={() => this.gotoNext()}
  //     onClose={() => closeLightbox()}
  //   />
  // );

  return (
    <ModalGateway>
      <Modal onClose={props.onclose}>
        <Carousel
          views={props.images.map((item) => {
            return {
              source: `${item}`,
              caption: props.caption
            };
          })}
          currentIndex={props.pos}
        />
      </Modal>
    </ModalGateway>
  );
};

export default ImageLightbox;
