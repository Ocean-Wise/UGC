/**
*
* InstagramTile
*
*/

import React from 'react';
import { withRouter } from 'react-router';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import P from 'components/P';
import Button from 'components/Button';
import axios from 'axios';


class InstagramTile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      approved: false,
      hashtag: this.props.history.location.pathname.substring(1),
      dbID: null,
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
    let content;
    if (data.content_type === 'image') {
      content = data.content[0].src;
    } else {
      content = data.content;
    }

    axios.post('http://172.19.1.14:3000/api/approve', {
      tag: this.state.hashtag,
      PostType: 'instagram',
      TextContent: data.text,
      ContentURL: content,
      Author: data.user.full_name,
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
          <Button id="button-of-disapproval" inverted onClick={() => { this.disapprove(); }}>
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

    let content;
    if (data.content_type === 'image') {
      content = <img src={data.content[0].src} alt="yup" style={{ width: '100%', height: '50%' }} />;
    } else {
      content = ( // eslint-disable-next-line
        <video controls style={{ width: '100%' }}>
          <source src={data.content} type="video/mp4" />
        </video>
      );
    }

    return (
      <Paper zDepth={3} style={{ width: '350px', height: '600px', overflowX: 'hidden' }}>
        {this.props.history.location.pathname === '/' ? null : approveButton}
        <center>
          {content}
          <P>
            <b>{data.user.full_name}</b>
            <img src={data.user.profile_pic_url} alt="profile" style={{ paddingLeft: '5px', height: '50px', width: '50px' }} />
          </P>
          <P style={{ overflowX: 'hidden', padding: '0 20px' }}>{data.text}</P>
        </center>
      </Paper>
    );
  }
}

InstagramTile.propTypes = {
  data: PropTypes.object.isRequired,
  history: PropTypes.object,
};

export default withRouter(InstagramTile);
