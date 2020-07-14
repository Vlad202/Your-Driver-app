import React, { Component } from 'react'
import {View, Text, TouchableOpacity } from 'react-native'
import MapView from 'react-native-maps';
import { Dimensions } from 'react-native';
import styles from '../Styles';

export class Map extends Component {
  state = {
    latitude: this.props.location.lat,
    longitude: this.props.location.lon,
    enableLocation: this.props.enableLocation,
  }
  
  render () {
    let width = Dimensions.get('window').width;
    return (
        <View style={{alignItems: 'center'}}>
            {/* <Text style={styles.linkSite}>Ваше местоположение:</Text> */}
            <MapView onPress={this.handleMarkerPress} style={{height: 300, width: width}}
                initialRegion={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.004,
                }}
                pinColor="red" 
            >
              <MapView.Marker
                coordinate={{latitude: this.props.location.lat,
                longitude: this.props.location.lon}}
                title={"Ваше местоположение"}
                description={"Местоположение может быть не точным, уточните детали с водителем по телефону."}
            />
            </MapView>
        </View>
    )
  }
}