import React, { Component } from 'react'
import * as Font from 'expo-font';
import styles from './Styles'
import {View, Text, ScrollView } from 'react-native'

export class Logo extends Component {
  async componentDiMount() {
    Font.loadAsync({
      SatisfyRegular: require('./assets/fonts/Satisfy-Regular.ttf'),
    });
    // await this.setState({
    //   fontLoaded: true,
    // });
  }
  render () {
    return (
        <View>
            <Text style={styles.Logo}>Your Driver</Text>
            <View style = {styles.lineStyle} />
        </View>
    )
  }
}