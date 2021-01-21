import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';

class SafeAreaViewCrossPlatform extends Component {
  render() {
    const { children, style } = this.props;

    return (
      <SafeAreaView style={[...style, styles.SafeAreaViewCrossPlatform]}>
        {children}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  SafeAreaViewCrossPlatform: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default SafeAreaViewCrossPlatform;
