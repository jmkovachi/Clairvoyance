import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Expo from 'expo';

class GeolocationExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      magHeading : null,
      trueHeading : null,
    };

    this.bearing = this.bearing.bind(this);
    this._toDeg = this._toDeg.bind(this);
    this._toRad = this._toRad.bind(this);
    this.convertToRotation = this.convertToRotation.bind(this);
  }

  componentDidMount() {
    Expo.Location.watchHeadingAsync(function (res) {
        this.setState({
            magHeading : res.magHeading,
            trueHeading : res.trueHeading,
        });
        console.log(this.state);
    }.bind(this));
    navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('helllllloooo');
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
  }

  bearing (lat1,lng1,lat2,lng2) {
    var dLon = (lng2-lng1);
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var brng = this._toDeg(Math.atan2(y, x));
    return 360 - ((brng + 360) % 360);
  }

    _toRad (deg) {
     return deg * Math.PI / 180;
    }

    /**
    * Since not all browsers implement this we have our own utility that will
    * convert from radians into degrees
    *
    * @param rad - The radians to be converted into degrees
    * @return degrees
    */
    _toDeg (rad) {
        return rad * 180 / Math.PI;
    }

  /*
    Middle of my intersection:
    {
        latitude : 34.041934,
        longitude : -84.503049
    }
  */
  convertToRotation(final_Long, final_Lat) {
    var bear = this.bearing(this.state.latitude, this.state.longitude, final_Lat, final_Long);
    return bear - this.state.magHeading;
  }



  render() {
    intersection = {
        latitude : 34.041934,
        longitude : -84.503049
    };

    return (
      <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
        <Text> Bearing: {this.bearing(this.state.latitude, this.state.longitude, intersection.latitude, intersection.longitude)} </Text>
        <Text> Convert: {this.convertToRotation(intersection.latitude, intersection.longitude)} </Text>
        {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
      </View>
    );
  }
}




export default GeolocationExample;