import React, { Component } from 'react'
import styles from '../Styles'
import {View, Text, Animated, ScrollView, Easing, Vibration, Image, Alert, TouchableOpacity, Linking} from 'react-native'
import SyncStorage from 'sync-storage';
import { Map } from './Map'
import axios from 'axios';
import {StackActions} from '@react-navigation/native'; 
import {Logo} from '../Logo';
import * as ru from '../langs/ru.json';
import * as uk from '../langs/uk.json';
import * as en from '../langs/en.json';
import Flag from 'react-native-flags';
import { Dimensions } from 'react-native';

export class OrderWait extends Component {
  constructor(props){
    super(props)
    this.state = {
      i: 1,
      flagWhile: true,
      lang_obj: {},
      location: {},
      driver_phone: '',
      appButtonContainer: {
        fontFamily: 'serif',
        elevation: 8,   
        backgroundColor: "#ffac33",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 5,
      },
      btnSuccess: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        fontFamily: 'serif',
        elevation: 8, 
        backgroundColor: "#ffac33",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 5,
        marginTop: '5%'
      },
      btnSuccessGreen: {
        fontFamily: 'serif',
        elevation: 8, 
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 5,
        marginTop: '5%'
      },
      btnDisableOrder: {
        fontFamily: 'serif',
        elevation: 8, 
        backgroundColor: "#ef5350",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 5,
      },
      orderCost: '',
      appButtonText: {
        fontFamily: 'serif',
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      },
      renderBtns: [],
      orderBtnText: '',
      rotateAnim: new Animated.Value(0)
    }
    try {
      if (this.props.route.params.driverTypeParam === 'fullDay') {
        // this.state.orderBtnText = this.state.lang_obj.searchFullDayDriver;
        this.state.appButtonText.fontSize = 15;
      } 
    } catch (error) {
      if (SyncStorage.get('driverType') === 'fullDay') {
        // this.state.orderBtnText = this.state.lang_obj.searchFullDayDriver;
        this.state.appButtonText.fontSize = 15;
      } 
    }
    try {
      this.state.location = this.props.route.params.location;
      this.state.orderCost = this.props.route.params.orderCost;
    } catch (error) {
      this.state.location = SyncStorage.get('location');
      this.state.orderCost = SyncStorage.get('orderCost');
    }
    this.state.orderBtnText = this.state.lang_obj.searchDriver;
  } 
  componentDidMount() {
    this.startAnimation()
    this.props.navigation.addListener('focus', () => {
        if (SyncStorage.get('lang') == undefined) {
            SyncStorage.set('lang', 'uk');
        }
        if (SyncStorage.get('lang') === 'ru') {
            this.setState({lang_obj: ru});
        }
        if (SyncStorage.get('lang') === 'uk') {
            this.setState({lang_obj: uk});
        }
        if (SyncStorage.get('lang') === 'en') {
            this.setState({lang_obj: en});
        }
    });
    this.driverDetector();
 }
 wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}
driverDetector = async () => {
  while(this.state.flagWhile) {
    axios.get('http://online.deluxe-taxi.kiev.ua:'+SyncStorage.get('port')+'/api/weborders/' + SyncStorage.get('uid'), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic YWNod...YQ==',
      }
    })
    .then(data => {
      console.log(SyncStorage.get('uid'));
      if (data.data.driver_execution_status === 2) {
        Vibration.vibrate(1000)
        this.setState({driverIsComming: true})
        this.state.flagWhile = false;
        SyncStorage.remove('uid')
        return null;
      }
      if (data.data.driver_execution_status === 7) {
        Vibration.vibrate(1000)
        this.state.flagWhile = false;
        SyncStorage.remove('uid')
        return null;
      }
      if (data.data.driver_phone) {
        if (!this.state.driverFoundFlag) {
          Vibration.vibrate(1000)
          this.setState({driverFoundFlag: true});
        }
        console.log(data.data)
        this.setState({driver_phone: data.data.driver_phone});
        this.setState({orderStatusFlag: true})
        this.setState(prevState => ({
          location: {
              ...prevState.location,
              lat: data.data.drivercar_position.lat,
              lon: data.data.drivercar_position.lng,
          }
        }))
        // return null;
      } else if (data.data.close_reason === 1) {
          Vibration.vibrate(1000)
          Alert.alert(this.state.lang_obj.driver_disable_order)
          this.setState({flagWhile: false});
          SyncStorage.remove('uid')
          this.props.navigation.dispatch(StackActions.replace('MainOrder'));
          return null
      } else {
        console.log('Driver not found');
      }
    });
    await this.wait(10000);
  };
}
  startAnimation () {
    this.state.rotateAnim.setValue(0)
    Animated.timing(
      this.state.rotateAnim,
      {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false
      }
    ).start(() => {
      this.startAnimation()
    })
  }
  disableOrderConfirm = () => {
    const url = 'http://online.deluxe-taxi.kiev.ua:'+SyncStorage.get('port')+'/api/weborders/cancel/' + this.state.orderCost;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic YWNod...YQ==',
      }
    })
    .then(data => {
      if (data.status === 200) {
        this.setState({flagWhile: false});
        SyncStorage.remove('uid')
        this.props.navigation.dispatch(StackActions.replace('MainOrder'));
      }
    })
    .catch(error => {
      console.log(error);
    });
    console.log(url);
  }
  disableOrder = () => {
    Alert.alert(this.state.lang_obj.areYouSure.name, this.state.lang_obj.areYouSure.body, [
      {
        text: this.state.lang_obj.areYouSure.no,
      },
      {
        text: this.state.lang_obj.areYouSure.yes,
        onPress: () => this.disableOrderConfirm()
      }
    ], { cancelable: false }
    )
  }
  _renderBtns () {
    if (this.state.orderStatusFlag) {
      return (
      <TouchableOpacity onPress={() => (Linking.openURL('tel:'+this.state.driver_phone))} style={this.state.btnSuccessGreen}>
        <Text style={styles.appButtonText}>{this.state.lang_obj.call}</Text>
      </TouchableOpacity>
      );
    } else {
      return null;
    }
  }
  _btnCardFound () {
    if (this.state.orderStatusFlag) {
      return (
        this.state.driverIsComming ? (
          <View style={this.state.btnSuccessGreen}>
            <Text style={this.state.appButtonText}>
                {this.state.lang_obj.driverIsComming}
            </Text>
          </View>
        ) : (
          <View style={this.state.btnSuccessGreen}>
            <Text style={this.state.appButtonText}>
                {this.state.lang_obj.driverIsFound}
            </Text>
          </View>
        )
      );
    } else {
      return (
        <View style={this.state.btnSuccess}>
          <Text style={this.state.appButtonText}>{this.state.orderStatus}</Text>
          <Animated.Image
          style={[styles.iconWait,
            {transform: [
              {rotate: this.state.rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  '0deg', '360deg'
                ]
              })}
            ]}
          ]}
          source={require('../socialImages/hourglass.png')} />
        </View>
      )
    }
  }
  _MapController = () => {
    console.log(this.state.street)
    return  (
      <View>
        <Map height={350} width={350} location={this.state.location} location_name={this.state.location_name} location_number={this.state.location_number} enableLocation={false} />
      </View>
    )
  }
    render() {
      this.state.orderStatus = this.state.lang_obj.searchDriver;
      const windowWidth = Dimensions.get('window').width;
      const windowHeight = Math.round(Dimensions.get('window').height);
      return (
        <ScrollView style={{height: windowHeight, backgroundColor: '#000'}}>
        <View style={{height: windowHeight, backgroundColor: '#000'}}>
        <View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                <Logo />
              </View>
              <View onPress={() => this.setState({lang_obj: ru})} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                  <TouchableOpacity onPress={() => {
                      this.setState({lang_obj: ru});
                      SyncStorage.set('lang', 'ru')
                  }}>
                  <Image 
                      style={{height: 30, width: 43}}
                      source={require('../socialImages/ru.jpg')}
                  />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                      this.setState({lang_obj: uk});
                      SyncStorage.set('lang', 'uk')
                  }}>
                  <Image 
                      style={{height: 30, width: 43}}
                      source={require('../socialImages/ua.png')}
                  />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                      this.setState({lang_obj: en});
                      SyncStorage.set('lang', 'en')
                  }}>
                  <Image 
                      style={{height: 30, width: 43}}
                      source={require('../socialImages/uk.png')}
                  />
                  </TouchableOpacity>
                </View>
            </View>
        <View style={styles.Main}>
          <View style={styles.OrderView}>
            <View>
              <View style={styles.orderBtns}>
                <TouchableOpacity onPress={this.disableOrder} style={this.state.btnDisableOrder}>
                  <Text style={styles.appButtonText}>{this.state.lang_obj.disableOrderBtn}</Text>
                </TouchableOpacity>                 
                  {this._btnCardFound()} 
                  {this._renderBtns()} 
                
              </View>
            </View>
          </View>
          {this._MapController()}
        </View>
        </View>
        </ScrollView>
      )
    }
  }