/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import axios from 'axios';
import StackGrid from 'react-stack-grid';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

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

export class ApprovedPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // Set up the state for the checkboxes
  constructor(props) {
    super(props);
    this.state = {
      insta: [],
      twitter: [],
      posts: [],
      tag: this.props.match.params.tracker,
      loading: true,
      confirmDelete: false,
      deleteValue: '',
      open: false,
    };
    this.getApproved = this.getApproved.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.doDelete = this.doDelete.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleDeleteField = this.handleDeleteField.bind(this);
  }


  /**
   * when initial state username is not null, submit the form to load repos
   */

  async componentDidMount() {
    await this.getApproved(this.state.tag);
  }

  getApproved(hashtag) {
    const { data } = this.props;

    axios.post('http://35.227.59.7/api/approvedPosts', { tag: hashtag })
      .then((res) => { // eslint-disable-line
        this.setState({ posts: res.data.data, loading: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Check if delete has been confirmed, then call the delete endpoint for the current tag
  doDelete() {
    const { confirmDelete } = this.state;
    if (confirmDelete) {
      axios.post('http://35.227.59.7/api/removeTracker', { tag: this.state.tag })
        .then(() => { // eslint-disable-line
          this.props.history.push('/');
          return true;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    } else {
      return false;
    }
    return false;
  }

  handleTagChange(tag) {
    this.setState({ tag: tag.target.value });
  }

  handleModal() {
    this.setState({ open: !this.state.open });
  }

  handleDeleteField(field) {
    this.setState({ deleteValue: field.target.value });
    if (this.state.deleteValue === 'delet') {
      this.setState({ confirmDelete: true });
    } else {
      this.setState({ confirmDelete: false });
    }
  }

  render() {
    const { posts, loading, confirmDelete } = this.state;

    let postList;
    if (posts.length > 0) {
      postList = posts.map((post, i) => {
        if (post === null) return null;
        if (post.posttype === 'instagram') {
          return <InstagramTile data={post} key={i.toString()} />;
        } else { // eslint-disable-line
          return <TwitterTile data={post} key={i.toString()} />;
        }
      });
    } else {
      postList = null;
    }

    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={() => { this.handleModal(); }}
        keyboardFocused
      />,
      <FlatButton
        label="Confirm"
        primary
        disabled={!confirmDelete}
        onClick={() => { this.doDelete(); }}
      />,
    ];

    return (
      <article>
        <Header />
        <Helmet>
          <title>Tracker Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <Wrapper>
          <Section style={{ textAlign: 'center' }}>
            <Link to={'/board/' + this.state.tag}>
              <Button id="return-button">
                Back to {this.state.tag} recents
              </Button>
            </Link>
            <H2>Approved Instagram & Twitter posts with #{this.state.tag}:</H2>
            <Button onClick={() => { this.handleModal(); }}>Delete this tracker?</Button>
            <Dialog
              title="Please confirm tracker deletion"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={() => { this.handleModal(); }}
            >
              Please type <em>delete</em> in the box to confirm deletion.<br />
              <TextField hintText="Type 'delete'" floatingLabelText="Confirm deletion" defaultValue={this.state.deleteValue} onChange={this.handleDeleteField} />
            </Dialog>
          </Section>
          {
            loading ? <center><H2>Loading...</H2></center> :
            <StackGrid columnWidth={350} gutterWidth={10} gutterHeight={15} style={{ textAlign: 'center', marginBottom: '40px' }}>
              {postList}
            </StackGrid>
          }
        </Wrapper>
      </article>
    );
  }
}

ApprovedPage.propTypes = {
  match: PropTypes.object.isRequired,
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

const withReducer = injectReducer({ key: 'ApprovedPage', reducer });
const withSaga = injectSaga({ key: 'ApprovedPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withRouter,
)(ApprovedPage);
