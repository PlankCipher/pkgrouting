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

    if (menuWillBeOpened) {
      menuLeft.setValue(-width);

      this.setState({
        menuOpened: menuWillBeOpened,
      });

      Animated.timing(this.state.menuLeft, {
        toValue: menuWillBeOpened ? 0 : -width,
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.overlayOpacity, {
        toValue: menuWillBeOpened ? 0.7 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(this.state.menuLeft, {
        toValue: menuWillBeOpened ? 0 : -width,
        duration: 350,
        useNativeDriver: false,
      }).start();

      Animated.timing(this.state.overlayOpacity, {
        toValue: menuWillBeOpened ? 0.7 : 0,
        duration: 350,
        useNativeDriver: false,
      }).start(() => this.setState({ menuOpened: menuWillBeOpened }));
    }
  };

  render() {
    const { overlayOpacity, menuLeft, menuOpened } = this.state;

    return (
      <>
        {menuOpened && (
          <TouchableWithoutFeedback onPress={this.toggle}>
            <Animated.View
              style={[styles.overlay, { opacity: overlayOpacity }]}
            ></Animated.View>
          </TouchableWithoutFeedback>
        )}

        <Animated.View
          style={[styles.menu, { left: menuLeft }, this.props.style]}
        >
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
    elevation: 4,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    elevation: 4,
  },
});

export default SideMenuCore;
