import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from 'components/A';
import Wrapper from './Wrapper';
import Section from './Section';
import messages from './messages';
import Logo from './Logo';
import OWLogo from './logo.svg';

function Footer() {
  return (
    <Wrapper>
      <Section style={{ margin: '0 auto' }}>
        <Logo src={OWLogo} alt="Ocean Wise" />
        <FormattedMessage
          {...messages.authorMessage}
          values={{
            author: <A href="https://edinnen.github.io/">Ethan Dinnen</A>,
          }}
        />
      </Section>
    </Wrapper>
  );
}

export default Footer;
