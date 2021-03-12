import React, { Component } from 'react';
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

class TopBar extends Component {
  state = {
    searchTerm: '',
  };

  handleSearchInputChange = (searchTerm) => {
    this.setState({
      searchTerm,
    });
  };

  render() {
    const { toggleSideMenu, locateMe } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.outer}>
          <TouchableWithoutFeedback onPress={toggleSideMenu}>
            <View style={styles.iconOuter}>
              <FontAwesome5 style={styles.icon} name="bars" />
            </View>
          </TouchableWithoutFeedback>
          <TextInput
            value={this.state.searchTerm}
            style={styles.input}
            placeholder="Search for places"
            onChangeText={this.handleSearchInputChange}
            onSubmitEditing={this.search}
          />
          <TouchableWithoutFeedback onPress={locateMe}>
            <View style={styles.iconOuter}>
              <FontAwesome5 style={styles.icon} name="map-marker-alt" />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

// TODO: Make sure the styles are
// TODO: are in the order of appearance
const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    top: 9,
  },
  outer: {
    backgroundColor: '#fff',
    width: `95%`,
    height: 50,
    borderRadius: 3,
    paddingVertical: 3,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  input: {
    width: '80%',
    fontSize: 21,
    paddingHorizontal: 7,
  },
  iconOuter: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 21,
    color: '#3B1C32dd',
  },
});

export default TopBar;
