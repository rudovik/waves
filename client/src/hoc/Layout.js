import React, { useEffect } from 'react';

import Header from '../components/Header_Footer/Header';
import Footer from '../components/Header_Footer/Footer';

import { connect } from 'react-redux';
import { getSiteData } from '../actions/site_actions';

const Layout = ({ children, dispatch, site }) => {
  useEffect(() => {
    const asyncFunc = async () => {
      try {
        if (!site.siteData || Object.keys(site.siteData) === 0) {
          await dispatch(getSiteData());
        }
      } catch (error) {}
    };
    asyncFunc();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Header />
      <div className="page_container">{children}</div>
      <Footer data={site} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    site: state.site
  };
};

export default connect(mapStateToProps)(Layout);
