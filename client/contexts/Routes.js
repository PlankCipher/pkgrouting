import React, { Component } from 'react';
import polylineDecode from '../utils/polylineDecode.js';

const { API_URL } = process.env;
const { GOOGLE_MAPS_API_KEY } = process.env;

const RoutesContext = React.createContext();

class RoutesContextProvider extends Component {
  getPath = async (stops) => {
    try {
      const { lat: firstLat, lng: firstLng } = stops.shift();
      const origin = encodeURIComponent(`${firstLat},${firstLng}`);

      const { lat: lastLat, lng: lastLng } = stops.pop();
      const destination = encodeURIComponent(`${lastLat},${lastLng}`);

      let waypoints = '';
      if (stops.length > 0) {
        const { lat: firstWaypointLat, lng: firstWaypointLng } = stops.shift();
        waypoints = `${firstWaypointLat},${firstWaypointLng}`;

        waypoints = stops.reduce((acc, curr) => {
          const { lat, lng } = curr;
          return `${acc}|${lat},${lng}`;
        }, waypoints);

        waypoints = encodeURIComponent(waypoints);
      }

      const googleApiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&key=${GOOGLE_MAPS_API_KEY}`;

      const res = await fetch(googleApiUrl);
      const { status: statusCode } = res;

      if (statusCode === 200) {
        const { routes } = await res.json();
        const {
          overview_polyline: { points },
        } = routes[0];

        const pathPoints = polylineDecode(points);
        const {
          distance: { text: distance },
          duration: { text: duration },
        } = routes[0].legs[0];

        return { err: null, path: { points: pathPoints, distance, duration } };
      } else {
        const err = new Error();
        err.statusCode = statusCode;
        throw err;
      }
    } catch (err) {
      return { err: { statusCode: err.statusCode }, path: null };
    }
  };

  generateRoute = async (stops) => {
    try {
      const res = await fetch(`${API_URL}/routes/generate`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ stops }),
      });
      const { status: statusCode } = res;

      if (statusCode === 200) {
        const { orderedStops } = await res.json();

        const { err, path } = await this.getPath(orderedStops);

        if (err) {
          const newErr = new Error();
          newError.statusCode = err.statusCode;
          throw newErr;
        } else {
          return { err: null, path };
        }
      } else {
        const err = new Error();
        err.statusCode = statusCode;
        throw err;
      }
    } catch (err) {
      return { err: { statusCode: err.statusCode }, path: null };
    }
  };

  state = {
    generateRoute: this.generateRoute,
  };

  render() {
    return (
      <RoutesContext.Provider value={this.state}>
        {this.props.children}
      </RoutesContext.Provider>
    );
  }
}

const RoutesContextConsumer = RoutesContext.Consumer;

export { RoutesContext, RoutesContextProvider, RoutesContextConsumer };
