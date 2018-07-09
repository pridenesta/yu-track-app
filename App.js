import _ from 'lodash';
import React, {Component} from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { MapView } from 'expo';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = -33.449022;
const LONGITUDE = -70.6714961;
const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      markers: []
    };
  }

  componentWillMount = async () => {
    try {
      const response = await fetch('https://sheltered-forest-35250.herokuapp.com/api/addresses');
      const markers = await response.json();
      this.setState({markers: markers['markers']});
    } catch (e) {
      console.log(e);
    }
  }

  onPressMarker(id) {
    const { markers } = this.state;
    const marker = markers[id];
    this.setState({
      latitude: marker.coords[0],
      longitude: marker.coords[1]
    })
  }

  addMarker(coordinates) {
    const newMarker = {"_id": Math.random(),"name":"Nuevo Punto","coords":[coordinates.latitude, coordinates.longitude]};
    this.setState(prevState => ({
      markers: [...prevState.markers, newMarker],
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    }))
  }

  render() {
    const { latitude, longitude, latitudeDelta, longitudeDelta, markers } = this.state;
    return (
      <View style ={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }}
          onPress={e => this.addMarker(e.nativeEvent.coordinate)}
        >
        {_.map(markers, (marker, index) =>
          <MapView.Marker key={index} coordinate={{ latitude: marker.coords[0], longitude: marker.coords[1]}} title={marker.name} onPress={()=>{ this.onPressMarker(index)} }>
          </MapView.Marker>
        )}
        </MapView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
},
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});