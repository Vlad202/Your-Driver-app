import React, { Component } from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native'
import MapView from 'react-native-maps';
import { Dimensions } from 'react-native';

export class Icon extends Component {
    render () {
        // const PATH = '../socialImages/' + this.props.name + '.png'
        // const IMAGE = require(this.props.name)
        console.log(this.props.name)
        return (
            <View>
                <Image 
                    style={{width: this.props.size}}
                    source={require('../socialImages/viber.png')}
                />
            </View>
        )
    }
}