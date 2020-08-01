import React, { Component, useState } from 'react'
import {View, Text, TouchableOpacity } from 'react-native'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { Dimensions } from 'react-native';
import styles from '../Styles';

export class Map extends Component {
  state = {
    latitude: this.props.location.lat,
    longitude: this.props.location.lon,
    enableLocation: this.props.enableLocation,
  }
  componentDidMount() {
    let region = {latitude: this.props.location.lat, longitude: this.props.location.lon, latitudeDelta: 0.001, longitudeDelta: 0.002}
    if (this.map !== undefined) {
      this.map.animateToRegion(region,1000)
    }
  }
  componentDidUpdate() {
    let region = {latitude: this.props.location.lat, longitude: this.props.location.lon, latitudeDelta: 0.001, longitudeDelta: 0.002}
    if (this.map !== undefined) {
      this.map.animateToRegion(region,1000)
    }
  }
  render () {
    return (
        <View style={{overflow: 'hidden', border: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
            <MapView onPress={this.handleMarkerPress} style={{height: this.props.height, width: this.props.width}}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.002,
                }}
                pinColor="red" 
                ref={(map) => { this.map = map; }}>
              <MapView.Marker
                coordinate={{
                  latitude: this.props.location.lat,
                  longitude: this.props.location.lon
              }}
              title={this.props.location_name}
            />
            </MapView>
        </View>
    )
  }
}