import React, { Component } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesome5 } from '@expo/vector-icons';
import SafeAreaViewCrossPlatform from '../components/SafeAreaViewCrossPlatform.js';

class Home extends Component {
  state = {
    location: {
      latitude: 0,
      longitude: 0,
    },
    stops: [],
  };

  handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    this.setState({
      stops: [
        ...this.state.stops,
        { id: uuidv4(), coords: { latitude, longitude } },
      ],
    });
  };

  handleStopMarkerPress = (currentId) => {
    const newStops = this.state.stops.filter(({ id }) => id != currentId);

    this.setState({
      stops: newStops,
    });
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
        location: {
          latitude,
          longitude,
        },
      });

      this.mapView.animateToRegion(
        {
          ...this.state.location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        700,
      );
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
      stops,
    } = this.state;

    return (
      <SafeAreaViewCrossPlatform>
        <MapView
          ref={(ref) => (this.mapView = ref)}
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: Number.MAX_VALUE,
            longitudeDelta: Number.MAX_VALUE,
          }}
          showsUserLocation={true}
          loadingEnabled={true}
          moveOnMarkerPress={false}
          onPress={this.handleMapPress}
          onPoiClick={this.handleMapPress}
        >
          {stops.map(({ id, coords }) => {
            return (
              <Marker
                coordinate={coords}
                // NOTE: should we use stopPropagation={true} to stop
                // NOTE: iOS map from re-placing markers when pressed?
                key={id}
                onPress={() => this.handleStopMarkerPress(id)}
              />
            );
          })}
        </MapView>
        {stops.length > 0 && (
          <TouchableWithoutFeedback
            onPress={() => this.setState({ stops: [] })}
          >
            <View style={styles.clearButtonOuter}>
              <FontAwesome5 style={styles.clearButton} name="trash-alt" solid />
            </View>
          </TouchableWithoutFeedback>
        )}
      </SafeAreaViewCrossPlatform>
    );
  }
}

const styles = StyleSheet.create({
  map: { height: '100%' },
  clearButtonOuter: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    borderColor: '#bbb',
    borderWidth: 1,
    position: 'absolute',
    bottom: 25,
    right: 21,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  clearButton: {
    fontSize: 21,
    color: 'red',
  },
});

export default Home;
