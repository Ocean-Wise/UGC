import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Button from 'components/Button';
import OceanWiseNav from 'components/OceanWiseNav';
import axios from 'axios';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import Container from './Container';
import Logo from './Logo';
import banner from './banner.jpg';
import messages from './messages';
import DeskLogo from './logo.svg';
import MobiLogo from './logo-mobile.svg';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      source: '',
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    if (this.state.width > 768) {
      this.state.source = DeskLogo;
    } else {
      this.state.source = MobiLogo;
    }
  }


  render() {
    const { source, trackers } = this.state;

    return (
      <div>
        <OceanWiseNav />
        <A href="https://ocean.org">
          <Container>
            <Logo src={source} alt="Logo" />
            <Img src={banner} alt="banner" />
          </Container>
        </A>
        <NavBar location={this.props.location}>
          <Link to="/">
            <Button id="home">
              Return home
            </Button>
          </Link>
          {/* {trackerPages} */}
        </NavBar>
      </div>
    );
  }
}

Header.propTypes = {
  location: PropTypes.object,
};

export default Header;
