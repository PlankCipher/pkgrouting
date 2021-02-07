import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import SafeAreaViewCrossPlatform from '../components/SafeAreaViewCrossPlatform.js';

class Loading extends Component {
  render() {
    return (
      <SafeAreaViewCrossPlatform style={[styles.loadingOuter]}>
        <ActivityIndicator
          size="large"
          color="#ff9457"
          style={styles.loadingIndicator}
        />
      </SafeAreaViewCrossPlatform>
    );
  }
}

const styles = StyleSheet.create({
  loadingOuter: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    transform: [{ scale: 1.7 }],
  },
});

export default Loading;
