import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';

class SafeAreaViewCrossPlatform extends Component {
  render() {
    const { children, style } = this.props;

    const totStyles = style
      ? [...style, styles.SafeAreaViewCrossPlatform]
      : styles.SafeAreaViewCrossPlatform;

    return (
      <SafeAreaView {...this.props} style={totStyles}>
        {children}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  SafeAreaViewCrossPlatform: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default SafeAreaViewCrossPlatform;
