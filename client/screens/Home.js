import React, { Component } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import SafeAreaViewCrossPlatform from '../components/SafeAreaViewCrossPlatform.js';

class Home extends Component {
  state = {
    location: {
      latitude: 0,
      longitude: 0,
    },
  };

  _getUserLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      // TODO: Handle rejection properly
      console.log('Permission not granted');
    } else {
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();

      this.setState({
        region: {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
      });

      this.mapView.animateToRegion(this.state.region, 700);
    }
  };

  async componentWillMount() {
    await this._getUserLocation();
  }

  // TODO: Don't forget to make this a protected route
  // that only renders if the user is logged in
  render() {
    const {
      location: { latitude, longitude },
    } = this.state;

    return (
      <SafeAreaViewCrossPlatform>
        <MapView
          ref={(ref) => (this.mapView = ref)}
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
          }}
        />
      </SafeAreaViewCrossPlatform>
    );
  }
}

const styles = StyleSheet.create({
  map: { height: '100%' },
});

export default Home;
