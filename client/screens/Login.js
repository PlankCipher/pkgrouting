import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import SafeAreaViewCrossPlatform from '../components/SafeAreaViewCrossPlatform.js';
import icon from '../assets/icon.png';

class Login extends Component {
  state = {
    username: '',
    password: '',
  };

  handleInputChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  submit = (navigate) => {
    // TODO: Add login logic
    navigate('Home');
  };

  // TODO: don't forget to make this route inaccessible
  // if user is logged in.
  render() {
    const {
      navigation: { navigate },
    } = this.props;

    return (
      <SafeAreaViewCrossPlatform style={[styles.outerContainer]}>
        <View style={styles.container}>
          <Image
            source={icon}
            style={styles.icon}
            accessibilityLabel="pkgrouting app icon"
          />

          <TextInput
            value={this.state.username}
            style={styles.input}
            placeholder="Username"
            returnKeyType="next"
            textContentType="username"
            autoCompleteType="off"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.secondTextInput.focus();
            }}
            onChangeText={(text) => this.handleInputChange('username', text)}
          />
          <TextInput
            value={this.state.password}
            style={styles.input}
            placeholder="Password"
            textContentType="password"
            secureTextEntry={true}
            autoCompleteType="off"
            ref={(input) => {
              this.secondTextInput = input;
            }}
            onChangeText={(text) => this.handleInputChange('password', text)}
            onSubmitEditing={() => this.submit(navigate)}
          />

          <TouchableWithoutFeedback onPress={() => this.submit(navigate)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </View>
          </TouchableWithoutFeedback>

          <Text style={styles.signupButton} onPress={() => navigate('SignUp')}>
            or Sign Up
          </Text>
        </View>
      </SafeAreaViewCrossPlatform>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    width: '65%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    fontSize: 25,
    marginTop: 15,
    borderColor: '#ff6145',
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 3,
    paddingHorizontal: 11,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 25,
    backgroundColor: '#ff9457',
    borderColor: '#ff9457',
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 3,
    paddingHorizontal: 11,
  },
  buttonText: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
  },
  signupButton: {
    color: '#ff6145',
    marginTop: 15,
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});

export default Login;
