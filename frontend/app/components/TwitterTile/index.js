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


class TwitterTile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.approved = this.approved.bind(this);
  }

  approved() {
    console.log("Post approved");
  }

  render() {
    const { data } = this.props;

    const approveButton = (
      <div style={{ margin: '5px' }}>
        <Button onClick={() => { this.approved(); }}>
          Approve
        </Button>
      </div>
    );

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
