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
import PropTypes from 'prop-types';
import axios from 'axios';
import StackGrid from 'react-stack-grid';

import P from 'components/P';
import H2 from 'components/H2';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import Header from 'components/Header';
import InstagramTile from 'components/InstagramTile';
import TwitterTile from 'components/TwitterTile';
import Button from 'components/Button';
import TextField from 'material-ui/TextField';
import Section from './Section';
import Wrapper from './Wrapper';
import reducer from './reducer';
import saga from './saga';

export class TrackerPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // Set up the state for the checkboxes
  constructor(props) {
    super(props);
    this.state = {
      insta: [],
      twitter: [],
      posts: [],
      tag: this.props.match.params.tracker,
      loading: true,
    };
    this.getData = this.getData.bind(this);
    this.shufflePosts = this.shufflePosts.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
  }


  /**
   * when initial state username is not null, submit the form to load repos
   */

  async componentDidMount() {
    await this.getData(this.state.tag);
  }

  getData(hashtag) {
    this.setState({ loading: true });
    axios.post('http://172.19.1.14:3000/api/getInsta', { tag: hashtag })
    .then((instaData) => {
      this.setState({ insta: instaData.data.data });
      axios.post('http://172.19.1.14:3000/api/getTwitter', { tag: hashtag })
      .then((twitterData) => {
        this.setState({ twitter: twitterData.data.data });
        this.shufflePosts();
        this.setState({ loading: false });
      });
    });
  }

  // Instagram sucks and doesn't give us a real timestamp, just a 'time pulled', stamp that equates to the unix year 1970
  // Merge the twitter and instagram data, shuffle with Fisher-Yates (Knuth) Shuffle algorithm
  shufflePosts() {
    const { insta, twitter } = this.state;
    const data = [...insta, ...twitter];

    // Initialize values to use in the shuffle
    let i = data.length + 1;
    let j;
    let tempi;
    let tempj;
    // While we still have unshuffled items left in the array
    while (i -= 1) { // eslint-disable-line
      j = Math.floor(Math.random() * i); // Choose a random j value
      // Swap values
      tempi = data[i - 1];
      tempj = data[j];
      data[i - 1] = tempj;
      data[j] = tempi;
    }
    this.setState({ posts: data });
  }

  handleTagChange(tag) {
    this.setState({ tag: tag.target.value });
  }

  render() {
    const { posts, loading } = this.state;

    let postList;
    if (posts.length > 0) {
      postList = posts.map((post, i) => {
        if (post === null) return null;
        if (post.post_type === 'instagram') {
          return <InstagramTile data={post} key={i.toString()} />;
        } else { // eslint-disable-line
          return <TwitterTile data={post} key={i.toString()} />;
        }
      });
    } else {
      postList = null;
    }

    return (
      <article>
        <Header />
        <Helmet>
          <title>Tracker Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <Wrapper>
          <Section style={{ textAlign: 'center' }}>
            <H2>Instagram & Twitter posts with #{this.state.tag}:</H2>
          </Section>
          {loading ? <center><H2>Loading...</H2></center> :
            <StackGrid columnWidth={350} gutterWidth={10} gutterHeight={15} style={{ textAlign: 'center', marginBottom: '40px' }}>
              {postList}
            </StackGrid>
          }
        </Wrapper>
      </article>
    );
  }
}

TrackerPage.propTypes = {
  match: PropTypes.object.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'trackerpage', reducer });
const withSaga = injectSaga({ key: 'trackerpage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TrackerPage);
