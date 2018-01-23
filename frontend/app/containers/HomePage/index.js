/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Header from 'components/Header';
import InstagramTile from 'components/InstagramTile';
import CenteredSection from './CenteredSection';
import Section from './Section';
import Wrapper from './Wrapper';
import reducer from './reducer';
import saga from './saga';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // Set up the state for the checkboxes
  constructor(props) {
    super(props);
    this.state = {
      insta: {},
    };
    this.getInsta = this.getInsta.bind(this);
  }


  /**
   * when initial state username is not null, submit the form to load repos
   */

  componentDidMount() {
    this.getInsta();
  }

  getInsta() {
    axios.post('http://172.19.1.14:3000/api/getTag', { tag: 'cave' })
    .then((res) => {
      this.setState({ insta: res.data.data });
    });
  }

  render() {
    const { insta } = this.state;

    let instaList;
    if (insta.length > 0) {
      instaList = insta.map((post, i) => { // eslint-disable-line
        return <InstagramTile data={post} key={i.toString()} />;
      });
    } else {
      instaList = null;
    }

    return (
      <article>
        <Header />
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <Wrapper>
          <CenteredSection>
            {instaList}
          </CenteredSection>
          <Section>

          </Section>
        </Wrapper>
      </article>
    );
  }
}

HomePage.propTypes = {
};

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
