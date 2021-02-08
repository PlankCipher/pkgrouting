import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import SafeAreaViewCrossPlatform from '../components/SafeAreaViewCrossPlatform.js';
import { UsersContext } from '../contexts/Users.js';
import icon from '../assets/icon.png';

class SignUp extends Component {
  static contextType = UsersContext;

  state = {
    name: '',
    password: '',
    loading: false,
  };

  handleInputChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  submit = async () => {
    this.setState({ loading: true });

    const { password } = this.state;
    let { name } = this.state;
    name = name.trim();

    if (name.length === 0 || password.length === 0) {
      Alert.alert('', 'You need to fill out all fields to proceed');
      this.setState({ loading: false });
    } else if (password.length < 8) {
      Alert.alert('', 'Password must be at least 8 characters');
      this.setState({ loading: false });
    } else {
      const { err } = await this.context.signUp(name, password);

      if (err) {
        const { statusCode } = err;

        if (statusCode === 409) {
          Alert.alert(
            'Username taken',
            `The username "${name}" is already taken.`,
          );
          this.setState({ loading: false });
        } else {
          Alert.alert(
            'Ooops!',
            'Something went wrong. Please try again later.',
          );
          this.setState({ loading: false });
        }
      }
    }
  };

  render() {
    const {
      navigation: { goBack },
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
            value={this.state.name}
            style={styles.input}
            placeholder="Username"
            returnKeyType="next"
            textContentType="username"
            autoCompleteType="off"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.secondTextInput.focus();
            }}
            onChangeText={(text) => this.handleInputChange('name', text)}
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
            onSubmitEditing={this.submit}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.buttonOuter}
            onPress={this.submit}
          >
            <View style={styles.button}>
              {this.state.loading ? (
                <ActivityIndicator
                  animating={this.state.loading}
                  size="large"
                  color="#fff7"
                />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.loginButton} onPress={() => goBack('Login')}>
            or Login
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
  buttonOuter: {
    width: '100%',
  },
  button: {
    height: 42,
    marginTop: 25,
    backgroundColor: '#ff9457',
    borderColor: '#ff9457',
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 3,
    paddingHorizontal: 11,
  },
  buttonText: {
    fontSize: 23,
    color: '#fff',
    textAlign: 'center',
  },
  loginButton: {
    color: '#ff6145',
    marginTop: 15,
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});

export default SignUp;
