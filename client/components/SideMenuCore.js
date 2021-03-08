import React, { Component } from 'react';
import { Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';

class SideMenuCore extends Component {
  state = {
    menuOpened: false,
    overlayOpacity: new Animated.Value(0),
    menuLeft: new Animated.Value(-999999),
  };

  toggle = () => {
    const { menuOpened, menuLeft } = this.state;
    const { width } = this.props;

    const menuWillBeOpened = !menuOpened;

    this.setState({
      menuOpened: menuWillBeOpened,
    });

    if (menuWillBeOpened) {
      menuLeft.setValue(-width);
    }

    Animated.timing(this.state.overlayOpacity, {
      toValue: menuWillBeOpened ? 0.7 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(this.state.menuLeft, {
      toValue: menuWillBeOpened ? 0 : -width,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  render() {
    const { overlayOpacity, menuLeft } = this.state;

    return (
      <>
        <TouchableWithoutFeedback onPress={this.toggle}>
          <Animated.View
            style={[styles.overlay, { opacity: overlayOpacity }]}
          ></Animated.View>
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.menu, { left: menuLeft }]}>
          {this.props.children}
        </Animated.View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    width: '71%',
    height: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
});

export default SideMenuCore;
