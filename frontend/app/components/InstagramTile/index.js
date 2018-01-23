/**
*
* InstagramTile
*
*/

import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import P from 'components/P';
import Button from 'components/Button';


class InstagramTile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.approved = this.approved.bind(this);
  }

  approved() {
    console.log("Post approved");
  }

  render() {
    const { data } = this.props;

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
        <div style={{ margin: '5px' }}>
          <Button onClick={() => { this.approved() }}>
            Approve
          </Button>
        </div>
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
};

export default InstagramTile;
