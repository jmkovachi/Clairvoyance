import Expo from 'expo';

class Geolocation {
    constructor() {
    
        this.state = {
          latitude: null,
          longitude: null,
          error: null,
          magHeading : null,
          trueHeading : null,
          bearing : null,
        };
    
        this.bearing = this.bearing.bind(this);
        this._toDeg = this._toDeg.bind(this);
        this._toRad = this._toRad.bind(this);
        
        Expo.Location.watchHeadingAsync(function (res) {
            this.magHeading = res.magHeading;
            this.trueHeading = res.trueHeading;
        }.bind(this));

        navigator.geolocation.getCurrentPosition(
            (position) => {
              this.state.latitude = position.coords.latitude;
              this.state.longitude = position.coords.longitude;
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
        this.state.bearing = 360 - ((brn + 360)) % 360;
        return this.state.bearing;
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

    convertToRotation(final_Long, final_Lat) {
        var bear = this.bearing(this.state.latitude, this.state.longitude, final_Lat, final_Long);
        return bear - this.state.magHeading;
      }
}

module.exports = Geolocation;