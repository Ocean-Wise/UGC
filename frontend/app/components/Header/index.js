import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Button from 'components/Button';
import OceanWiseNav from 'components/OceanWiseNav';
import axios from 'axios';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import Banner from './banner.jpg';
import Container from './Container';
import Logo from './Logo';
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
      trackers: [],
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.getTrackedTags = this.getTrackedTags.bind(this);
  }

  componentWillMount() {
    this.getTrackedTags();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  getTrackedTags() {
    axios.get('http://172.19.1.14:3000/api/getTrackedTags')
    .then((res) => {
      this.setState({ trackers: res.data.data });
    })
    .catch((err) => {
      console.log(err);
    });
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

    const trackerPages = trackers.map((tracker) => { // eslint-disable-line
      const url = '/' + tracker.tablename; // eslint-disable-line
      const id = tracker.tablename + '-button'; // eslint-disable-line
      return (
        <Link key={tracker.tablename} to={url}>
          <Button id={id}>
            {tracker.tablename.charAt(0).toUpperCase() + tracker.tablename.slice(1)}
          </Button>
        </Link>
      );
    });
    // eslint-enable

    return (
      <div>
        <OceanWiseNav />
        <A href="https://ocean.org">
          <Container>
            <Logo src={source} alt="Logo" />
            <Img src={Banner} alt="Ocean wise" />
          </Container>
        </A>
        <NavBar>
          <Link to="/">
            <Button id="home">
              <FormattedMessage {...messages.home} />
            </Button>
          </Link>
          {trackerPages}
        </NavBar>
      </div>
    );
  }
}

export default Header;
