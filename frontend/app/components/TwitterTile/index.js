/**
*
* TwitterTile
*
*/

import React from 'react';
import { withRouter } from 'react-router';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import P from 'components/P';
import Button from 'components/Button';
import axios from 'axios';


class TwitterTile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      approved: false,
      hashtag: this.props.history.location.pathname.substring(1),
      dbID: '',
    };
    this.approved = this.approved.bind(this);
    this.isApproved = this.isApproved.bind(this);
    this.disapprove = this.disapprove.bind(this);
  }

  componentWillMount() {
    this.setState({ approved: this.isApproved() });
  }

  approved() {
    const { data } = this.props;

    axios.post('http://172.19.1.14:3000/api/approve', {
      tag: this.state.hashtag,
      PostType: 'twitter',
      TextContent: data.text,
      ContentURL: null,
      Author: data.user.username,
    })
      .then(() => {
        this.setState({ approved: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  disapprove() {
    axios.post('http://172.19.1.14:3000/api/disapprove', { tag: this.state.hashtag, ID: this.state.dbID })
      .then(() => {
        this.setState({ approved: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  isApproved() {
    const { data } = this.props;

    axios.post('http://172.19.1.14:3000/api/approvedPosts', { tag: this.state.hashtag })
      .then((res) => { // eslint-disable-line
        for (let i = 0; i < res.data.data.length; i += 1) {
          if (res.data.data[i].textcontent === data.text) {
            this.setState({ dbID: parseInt(res.data.data[i].id), approved: true }); // eslint-disable-line
            return true;
          }
        }
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
    return false;
  }

  render() {
    const { data } = this.props;
    const { approved } = this.state;

    let approveButton;
    if (approved) {
      approveButton = (
        <div style={{ margin: '5px' }}>
          <Button id="button-of-disapproval" onClick={() => { this.disapprove(); }}>
            Disapprove
          </Button>
        </div>
      );
    } else {
      approveButton = (
        <div style={{ margin: '5px' }}>
          <Button id="button-of-approval" onClick={() => { this.approved(); }}>
            Approve
          </Button>
        </div>
      );
    }


    return (
      <Paper zDepth={3} style={{ width: '350px', height: '250px', overflowX: 'hidden' }}>
        {this.props.history.location.pathname === '/' ? null : approveButton}
        <P>
          {data.user.username}
          <img src={data.user.profile_img} alt="profile" style={{ paddingLeft: '5px' }} />
        </P>
        <center>
          <P style={{ overflowX: 'hidden', padding: '0 20px' }}>{data.text}</P>
        </center>
      </Paper>
    );
  }
}

TwitterTile.propTypes = {
  data: PropTypes.object.isRequired,
  history: PropTypes.object,
};

export default withRouter(TwitterTile);
