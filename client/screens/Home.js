import React, { Component } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import {
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesome5 } from '@expo/vector-icons';
import SafeAreaViewCrossPlatform from '../components/SafeAreaViewCrossPlatform.js';
import { RoutesContext } from '../contexts/Routes.js';

class Home extends Component {
  static contextType = RoutesContext;

  state = {
    location: {
      latitude: 0,
      longitude: 0,
    },
    stops: [],
    loading: false,
    path: {
      points: [],
    },
  };

  handleMapPress = (event) => {
    if (!this.state.loading) {
      const { latitude, longitude } = event.nativeEvent.coordinate;

      this.setState({
        stops: [
          ...this.state.stops,
          { id: uuidv4(), coords: { latitude, longitude } },
        ],
        path: {
          points: [],
          duration: null,
          distance: null,
        },
      });
    }
  };

  handleStopMarkerPress = (currentId) => {
    if (!this.state.loading) {
      const newStops = this.state.stops.filter(({ id }) => id != currentId);

      this.setState({
        stops: newStops,
      });
    }
  };

  handleClearMapButtonPress = () => {
    if (!this.state.loading) {
      this.setState({ stops: [] });
    }
  };

  handleGenerateRouteButtonPress = async () => {
    if (!this.state.loading) {
      this.setState({ loading: true });

      const { stops } = this.state;

      if (stops.length < 2) {
        Alert.alert('', 'At least 2 points are required to generate a route');
      } else {
        const newStops = stops.map((stop) => {
          const {
            coords: { latitude, longitude },
          } = stop;

          return { lat: latitude, lng: longitude };
        });

        const { err, path } = await this.context.generateRoute(newStops);
        if (err && err.statusCode === 422) {
          Alert.alert(
            '',
            'Provided coordinates are invalid. Please try again later',
          );
        } else if (err) {
          Alert.alert('Ooops!', 'Something went wrong. Please try again later');
        } else {
          this.setState({ path });
        }
      }
    }

    this.setState({ loading: false });
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

  render() {
    const {
      location: { latitude, longitude },
      stops,
      path: { points, distance, duration },
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
          showsMyLocationButton={false}
          loadingEnabled={true}
          moveOnMarkerPress={false}
          onPress={this.handleMapPress}
          onPoiClick={this.handleMapPress}
        >
          {stops.map(({ id, coords }) => {
            return (
              <Marker
                pinColor={id === stops[0].id ? '#001a00' : 'red'}
                coordinate={coords}
                // NOTE: should we use stopPropagation={true} to stop
                // NOTE: iOS map from re-placing markers when pressed?
                key={id}
                onPress={() => this.handleStopMarkerPress(id)}
              />
            );
          })}

          {points.length > 0 && (
            <Polyline
              coordinates={points}
              strokeColor="dodgerblue"
              strokeWidth={4}
            />
          )}
        </MapView>

        <View style={styles.routeInfo}>
          {distance && (
            <View>
              <Text style={styles.routeInfoText}>{distance}</Text>
            </View>
          )}
          {duration && (
            <View>
              <Text style={styles.routeInfoText}>{duration}</Text>
            </View>
          )}
        </View>

        {stops.length > 0 && (
          <TouchableWithoutFeedback onPress={this.handleClearMapButtonPress}>
            <View style={styles.clearButtonOuter}>
              <FontAwesome5 style={styles.clearButton} name="trash-alt" solid />
            </View>
          </TouchableWithoutFeedback>
        )}

        {stops.length > 1 && (
          <TouchableWithoutFeedback
            onPress={this.handleGenerateRouteButtonPress}
          >
            <View style={styles.generateRouteButtonOuter}>
              {this.state.loading ? (
                <ActivityIndicator
                  animating={this.state.loading}
                  size="large"
                  color="#0f07"
                />
              ) : (
                <>
                  <FontAwesome5
                    style={styles.generateRouteButton}
                    name="route"
                    solid
                  />
                  <Text>Generate Route</Text>
                </>
              )}
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
    width: 43,
    height: 43,
    borderRadius: 43 / 2,
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
    color: '#f00f',
  },
  generateRouteButtonOuter: {
    width: 150,
    height: 43,
    paddingHorizontal: 11,
    borderRadius: 43 / 2,
    borderColor: '#bbb',
    borderWidth: 1,
    position: 'absolute',
    bottom: 25,
    left: 21,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
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
  generateRouteButton: {
    fontSize: 23,
    color: '#0f0f',
    marginRight: 7,
  },
  routeInfo: {
    position: 'absolute',
    bottom: 25 + 44 + 5,
    left: 21,
    display: 'flex',
    justifyContent: 'center',
  },
  routeInfoText: {
    fontSize: 18,
    marginTop: 5,
  },
});

export default Home;
