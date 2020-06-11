import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';
import CircularProgress from '@material-ui/core/CircularProgress';

const FileUpload = (props) => {
  const [state, setState] = useState({
    uploadedFiles: [],
    uploading: false
  });

  useEffect(() => {
    props.imagesHandler(state.uploadedFiles);
    console.log('Hello there!');
    // eslint-disable-next-line
  }, [state.uploadedFiles]);

  const showUploadedImages = () =>
    state.uploadedFiles.map((item) => (
      <div
        className="dropzone_box"
        key={item.public_id}
        onClick={() => onRemove(item.public_id)}
      >
        <div
          className="wrap"
          style={{ background: `url(${item.url}) no-repeat` }}
        ></div>
      </div>
    ));

  const onRemove = (id) => {
    axios.get(`/api/users/removeimage?public_id=${id}`).then((response) => {
      let images = state.uploadedFiles.filter((item) => {
        return item.public_id !== id;
      });

      setState({
        ...state,
        uploadedFiles: images
      });
    });
  };

  const onDrop = (files) => {
    setState({ ...state, uploading: true });
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' }
    };

    formData.append('file', files[0]);

    axios.post('/api/users/uploadimage', formData, config).then((response) => {
      console.log(response.data);

      setState({
        ...state,
        uploading: false,
        uploadedFiles: [...state.uploadedFiles, response.data]
      });
    });
  };
  return (
    <div className="dropzone clear">
      <Dropzone onDrop={(e) => onDrop(e)}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()} className="dropzone_box">
              <div className="wrap">
                <input {...getInputProps()} />
                <FontAwesomeIcon icon={faPlusCircle} />
              </div>
            </div>
          </section>
        )}
      </Dropzone>
      {showUploadedImages()}
      {state.uploading ? (
        <div
          className="dropzone_box"
          style={{ textAligh: 'center', paddingTop: '60px', margin: '0 auto' }}
        >
          <CircularProgress
            size={40}
            style={{
              display: 'block',
              color: '#00bcd4',
              margin: '0 auto'
            }}
            thickness={7}
          />
        </div>
      ) : null}
    </div>
  );
};

export default FileUpload;
