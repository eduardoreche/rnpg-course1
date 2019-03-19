import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';

import startMainTabs from '../MainTabs/startMainTabs';
import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import ButtonWithBackground from '../../components/UI/ButtonWithBackground/ButtonWithBackground';
import backgroundImage from '../../assets/background.jpg';
import validate from '../../utility/validation';

class AuthScreen extends Component {
  state = {
    viewMode: Dimensions.get('window').height > 500 ? 'portrait' : 'landscape',
    controls: {
      email: {
        value: '',
        valid: false,
        touched: false,
        validationRules: {
          isEmail: true
        }
      },
      password: {
        value: '',
        valid: false,
        touched: false,
        validationRules: {
          minLength: 6
        }
      },
      confirmPassword: {
        value: '',
        valid: false,
        touched: false,
        validationRules: {
          equalTo: 'password'
        }
      }
    }
  };

  constructor(props) {
    super(props);

    Dimensions.addEventListener('change', this.updateStyles);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateStyles);
  }

  updateStyles = dims => {
    this.setState({
      viewMode: dims.window.height > 500 ? 'portrait' : 'landscape'
    });
  };

  loginHandler = () => {
    startMainTabs();
  };

  updateInputState = (key, value) => {
    let connectedValue = {};
    if (this.state.controls[key].validationRules.equalTo) {
      const equalControl = this.state.controls[key].validationRules.equalTo;
      const equalValue = this.state.controls[equalControl].value;
      connectedValue = {
        ...connectedValue,
        equalTo: equalValue
      };
    }
    if (key === 'password') {
      connectedValue = {
        ...connectedValue,
        equalTo: value
      };
    }
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          confirmPassword: {
            ...prevState.controls.confirmPassword,
            valid:
              key === 'password'
                ? validate(
                    prevState.controls.confirmPassword.value,
                    prevState.controls.confirmPassword.validationRules,
                    connectedValue
                  )
                : prevState.controls.confirmPassword.valid
          },
          [key]: {
            ...prevState.controls[key],
            value: value,
            touched: true,
            valid: validate(
              value,
              prevState.controls[key].validationRules,
              connectedValue
            )
          }
        }
      };
    });
  };

  render() {
    let headingText = null;
    const { viewMode } = this.state;

    if (viewMode === 'portrait') {
      headingText = (
        <MainText>
          <HeadingText>Please Log In</HeadingText>
        </MainText>
      );
    }

    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.container}>
          {headingText}
          <ButtonWithBackground color="#29aaf4" onPress={() => alert('hello')}>
            Switch to Login
          </ButtonWithBackground>

          <View style={styles.inputContainer}>
            <DefaultInput
              placeholder="Your email address"
              style={styles.input}
              value={this.state.controls.email.value}
              valid={this.state.controls.email.valid}
              touched={this.state.controls.email.touched}
              onChangeText={val => this.updateInputState('email', val)}
            />
            <View
              style={
                viewMode === 'portrait'
                  ? styles.portraitPasswordContainer
                  : styles.landscapePasswordContainer
              }
            >
              <View
                style={
                  viewMode === 'portrait'
                    ? styles.portraitPasswordWrapper
                    : styles.landscapePasswordWrapper
                }
              >
                <DefaultInput
                  placeholder="Password"
                  style={styles.input}
                  value={this.state.controls.password.value}
                  valid={this.state.controls.password.valid}
                  touched={this.state.controls.password.touched}
                  onChangeText={val => this.updateInputState('password', val)}
                />
              </View>
              <View
                style={
                  viewMode === 'portrait'
                    ? styles.portraitPasswordWrapper
                    : styles.landscapePasswordWrapper
                }
              >
                <DefaultInput
                  placeholder="Confirm Password"
                  style={styles.input}
                  value={this.state.controls.confirmPassword.value}
                  valid={this.state.controls.confirmPassword.valid}
                  touched={this.state.controls.confirmPassword.touched}
                  onChangeText={val =>
                    this.updateInputState('confirmPassword', val)
                  }
                />
              </View>
            </View>
          </View>

          <ButtonWithBackground
            onPress={this.loginHandler}
            color="#29aaf4"
            disabled={
              !this.state.controls.confirmPassword.valid ||
              !this.state.controls.password.valid ||
              !this.state.controls.email.valid
            }
          >
            Submit
          </ButtonWithBackground>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backgroundImage: {
    width: '100%',
    flex: 1
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: '#eee',
    borderColor: '#bbb'
  },
  landscapePasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  portraitPasswordContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  landscapePasswordWrapper: {
    width: '45%'
  },
  portraitPasswordWrapper: {
    width: '100%'
  }
});

export default AuthScreen;
