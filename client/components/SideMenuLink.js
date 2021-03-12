import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

class SideMenuLink extends Component {
  handleLinkPress = () => {
    const {
      navigate,
      link: { name },
      sideMenuToggle,
    } = this.props;

    navigate(name);
    sideMenuToggle();
  };

  render() {
    const {
      link: { name, active, iconName },
    } = this.props;

    return (
      <TouchableOpacity onPress={this.handleLinkPress} activeOpacity={0.7}>
        <View style={styles.outer}>
          <View style={styles.iconOuter}>
            <FontAwesome5
              style={active ? [styles.icon, styles.activeIcon] : styles.icon}
              name={iconName}
              solid
            />
          </View>
          <Text style={active ? [styles.name, styles.activeName] : styles.name}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  outer: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 10,
  },
  iconOuter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
    width: 30,
  },
  icon: {
    fontSize: 21,
    color: '#3B1C32dd',
  },
  activeIcon: {
    color: '#ff9457',
  },
  name: {
    fontSize: 21,
    flex: 1,
    color: '#3B1C32dd',
  },
  activeName: {
    color: '#ff9457',
    fontWeight: 'bold',
  },
});

export default SideMenuLink;
