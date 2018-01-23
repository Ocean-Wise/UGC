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

import P from 'components/P';
import H2 from 'components/H2';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Header from 'components/Header';
import InstagramTile from 'components/InstagramTile';
import Button from 'components/Button';
import TextField from 'material-ui/TextField';
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
      tag: '',
    };
    this.getInsta = this.getInsta.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
  }


  /**
   * when initial state username is not null, submit the form to load repos
   */

  componentDidMount() {
    this.getInsta();
  }

  getInsta() {
    axios.post('http://172.19.1.14:3000/api/getTag', { tag: 'ocean' })
    .then((res) => {
      this.setState({ insta: res.data.data });
    });
  }

  handleTagChange(tag) {
    this.setState({ tag: tag.target.value });
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
            <H2>Instagram posts with #ocean:</H2>
            <P>Refresh to reload</P>
            {/* Enter a tag: <TextField hintText="Enter hashtag without # symbol" floatingLabelText="Hashtag" defaultValue={this.state.tag} onChange={this.handleTagChange} />
            <Button onClick={this.getInsta(this.state.tag)}>Get Posts</Button> */}
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
