/**
*
* InstagramTile
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import P from 'components/P';
import Container from './Container';
import Paper from 'material-ui/Paper';
// import styled from 'styled-components';


class InstagramTile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { data } = this.props;

    let content;
    if (data.content_type === 'image') {
      content = <img src={data.content[0].src} alt="yup" />;
    } else {
      content = (
        <video controls>
          <source src={data.content} type="video/mp4" />
        </video>
      );
    }

    return (
      <Paper zDepth={3} style={{ width: '750px', padding: '25px', marginBottom: '10px' }}>
        <P>
          {data.user.full_name}
          <img src={data.user.profile_pic_url} alt="profile" style={{ paddingLeft: '5px' }} />
        </P>
        <center>
          {content}
          <P>{data.text}</P>
        </center>
      </Paper>
    );
  }
}

InstagramTile.propTypes = {
  data: PropTypes.object.isRequired,
};

export default InstagramTile;
