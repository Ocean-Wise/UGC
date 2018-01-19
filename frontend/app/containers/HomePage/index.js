/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import Header from 'components/Header';
import H2 from 'components/H2';
import P from 'components/P';
import CheckBox from 'components/CheckBox';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import Wrapper from './Wrapper';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // Set up the state for the checkboxes
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      radio: 'not_light',
    };
    this.handleCheck = this.handleCheck.bind(this);
    this.radioChange = this.radioChange.bind(this);
  }


  /**
   * when initial state username is not null, submit the form to load repos
   */

  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
  }

  // Handle checkbox checks. Update the items selected in the 'checked' state array
  handleCheck = (data) => {
    const { checked } = this.state;
    if (checked.some((item) => data === item)) { // If the checked item is already in the array remove it
      const i = checked.indexOf(data);
      checked.splice(i, 1);
      this.setState({ checked });
    } else { // Otherwise append it
      this.setState({ checked: [...checked, data] });
    }
  }

  radioChange(e) {
    this.setState({
      radio: e.currentTarget.value,
    });
  }

  render() {
    const { loading, error, repos } = this.props;
    const reposListProps = {
      loading,
      error,
      repos,
    };

    const styles = {
      radioButton: {
        marginBottom: 16,
      },
    };

    let checkedVals;
    if (this.state.checked.length === 0) {
      checkedVals = 'none';
    } else {
      checkedVals = this.state.checked.join(', ');
    }

    return (
      <article>
        <Header />
        <Helmet>
          <title>Home Page</title>
          <meta name="description" content="A React.js Boilerplate application homepage" />
        </Helmet>
        <Wrapper>
          <CenteredSection>
            <H2>
              <FormattedMessage {...messages.startProjectHeader} />
            </H2>
            <P>
              <FormattedMessage {...messages.startProjectMessage} />
            </P>
            <span>Checked: { checkedVals }</span>
            <br />
            <center style={{ display: 'inline-flex', flexDirection: 'row' }}>
              <CheckBox id="standard" callback={this.handleCheck} label="Checkbox" />
              <CheckBox id="heart" heart callback={this.handleCheck} label="Heart" />
              <CheckBox id="visibility" visibility callback={this.handleCheck} label="Visibility" />
            </center>
            <br />
            <span>Selected: {this.state.radio}</span>
            <br />
            <center id="radios" style={{ display: 'inline-flex', flexDirection: 'row' }}>
              <RadioButtonGroup onChange={this.radioChange} name="exampleRadios" defaultSelected="2">
                <RadioButton
                  value="1"
                  label="Simple"
                  style={styles.radioButton}
                />
                <RadioButton
                  value="2"
                  label="Selected by default"
                  style={styles.radioButton}
                />
                <RadioButton
                  value="3"
                  label="Custom icon"
                  checkedIcon={<ActionFavorite style={{ color: '#F44336' }} />}
                  uncheckedIcon={<ActionFavoriteBorder />}
                  style={styles.radioButton}
                />
              </RadioButtonGroup>
            </center>
          </CenteredSection>
          <Section>
            <H2>
              <FormattedMessage {...messages.trymeHeader} />
            </H2>
            <Form onSubmit={this.props.onSubmitForm}>
              <label htmlFor="username">
                <FormattedMessage {...messages.trymeMessage} />
                <AtPrefix>
                  <FormattedMessage {...messages.trymeAtPrefix} />
                </AtPrefix>
                <Input
                  id="username"
                  type="text"
                  placeholder="mxstbr"
                  value={this.props.username}
                  onChange={this.props.onChangeUsername}
                />
              </label>
            </Form>
            <ReposList {...reposListProps} />
          </Section>
        </Wrapper>
      </article>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  repos: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(HomePage);
