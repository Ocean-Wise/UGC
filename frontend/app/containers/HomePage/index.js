/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import axios from 'axios';
import StackGrid from 'react-stack-grid';

import H1 from 'components/H1';
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

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // Set up the state for the checkboxes
  constructor(props) {
    super(props);
    this.state = {
      insta: [],
      twitter: [],
      posts: [],
      tag: '',
      loading: false,
      trackers: [],
    };
    this.getTrackedTags = this.getTrackedTags.bind(this);
    this.getData = this.getData.bind(this);
    this.shufflePosts = this.shufflePosts.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.newTracker = this.newTracker.bind(this);
  }

  componentWillMount() {
    this.getTrackedTags();
  }

  getTrackedTags() {
    axios.get('http://35.227.59.7/api/getTrackedTags')
    .then((res) => {
      this.setState({ trackers: res.data.data });
    })
    .catch((err) => {
      console.log(err); // eslint-disable-line
    });
  }

  getData(hashtag) {
    this.setState({ loading: true });
    axios.post('http://35.227.59.7/api/getInsta', { tag: hashtag })
    .then((instaData) => {
      this.setState({ insta: instaData.data.data });
      axios.post('http://35.227.59.7/api/getTwitter', { tag: hashtag })
      .then((twitterData) => {
        this.setState({ twitter: twitterData.data.data });
        this.shufflePosts();
        this.setState({ loading: false });
      });
    });
  }

  newTracker(hashtag) {
    axios.post('http://35.227.59.7/api/tracker', { tag: hashtag })
      .then((res) => {
        console.log(res); // eslint-disable-line
        this.props.history.push('/board/' + hashtag); // eslint-disable-line
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line
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
    const { posts, loading, trackers } = this.state;

    const trackerPages = trackers.map((tracker) => { // eslint-disable-line
      const url = '/board/' + tracker.tablename; // eslint-disable-line
      const id = tracker.tablename + '-button'; // eslint-disable-line
      return (
        <Link key={tracker.tablename} to={url}>
          <Button id={id}>
            {tracker.tablename.charAt(0).toUpperCase() + tracker.tablename.slice(1)}
          </Button>
        </Link>
      );
    });

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
          <title>Home Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <Wrapper>
          <Section style={{ textAlign: 'center' }}>
            <H1>Currently tracked tags:</H1>
            {trackerPages}
            <H2>Instagram & Twitter posts with #{this.state.tag}:</H2>
            Enter a tag: <TextField hintText="Enter hashtag without # symbol" floatingLabelText="Hashtag" defaultValue={this.state.tag} onChange={this.handleTagChange} /><br />
            <Button onClick={() => { this.newTracker(this.state.tag); }}>Add as new tracker</Button><br />
            {loading ? <Button>Loading...</Button> : <Button onClick={() => { this.getData(this.state.tag); }}>Get Sample Posts</Button>}<br />
          </Section>
          <StackGrid columnWidth={350} gutterWidth={10} gutterHeight={15} style={{ textAlign: 'center', marginBottom: '40px' }}>
            {postList}
          </StackGrid>
        </Wrapper>
      </article>
    );
  }
}

HomePage.propTypes = {
  history: PropTypes.object,
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
  withRouter,
)(HomePage);
