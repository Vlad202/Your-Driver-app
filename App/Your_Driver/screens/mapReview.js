import React, { Component } from 'react'
import styles from '../Styles'
import {View, Text, TextInput, Alert, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView} from 'react-native'
import SyncStorage from 'sync-storage';
import { Map } from './Map'
import axios from 'axios';
import {StackActions} from '@react-navigation/native'; 
import {Logo} from '../Logo';
import * as ru from '../langs/ru.json';
import * as uk from '../langs/uk.json';
import * as en from '../langs/en.json';
import Flag from 'react-native-flags';
import { AntDesign } from '@expo/vector-icons'; 
import { Dimensions } from 'react-native';

export class MapReview extends Component {
  constructor(props){
    super(props)
    this.state = {
      checkboxValue: undefined,
      location: {},
      lang_obj: {},
      location_name: '',
      geo_locations: {},
      appButtonContainer: {
        fontFamily: 'serif',
        elevation: 8, 
        backgroundColor: "#ffac33",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 5,
      },
      // green 009688
      appButtonContainerConfirm: {
        fontFamily: 'serif',
        elevation: 8, 
        backgroundColor: "#ffac33",
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
      tariffs: [],
      chooseAddr: {
        padding: 10,
        width: '60%',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 3,
        borderColor: '#ffac33',
        borderRadius: 15
      },
      marker_color: "#ffac33",
      editAddressText: 'Изменить адрес',
      // secondAddressText: 'Укажите адрес'
    } 
    this.state.orderBtnText = this.state.lang_obj.searchDriver;
    if (this.props.route.params.driverTypeParam === 'fullDay') {
      this.state.orderBtnText = this.state.lang_obj.searchFullDayDriver;
      this.state.appButtonText.fontSize = 15;
    } else {
      this.state.orderBtnText = this.state.lang_obj.searchDriver;
    }
    this.state.location = this.props.route.params.location;
    this.state.orderCost = this.props.route.params.orderCost;
  }
  componentDidMount() {
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
        if (this.props.route.params.driverTypeParam === 'fullDay') {
          this.state.appButtonContainerConfirm.backgroundColor = '#009688'
        }
        this.state.editAddressText = this.state.lang_obj.editAddressText
        if (!this.props.route.params.firstAddress) {
          if (this.state.location_name === undefined) {
            navigator.geolocation.getCurrentPosition(
              position => {
                let lon = position['coords']['longitude'];
                let lat = position['coords']['latitude'];
                const location = {
                  lon: lon,
                  lat: lat,
                }
                this.state.location = location;
              },
              error => {
                console.log(error);
                Alert.alert(this.state.lang_obj.errors.geoError.name, this.state.lang_obj.errors.geoError.body)
              },
              { maximumAge: 0 },
            );
            axios.get('http://online.deluxe-taxi.kiev.ua:'+SyncStorage.get('port')+'/api/geodata/search?lat='+this.state.location.lat+'&lng='+this.state.location.lon+'&r=500', {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                // 'Authorization': 'Basic YWNod...YQ==',
              }
            })
            .then( data => {
                if (data.data.geo_streets.geo_street.length !== 0) {
                  this.state.geo_locations = data.data.geo_streets.geo_street;
                  let lats = [];
                  let lngs = [];
                  this.state.geo_locations.forEach((i) => {
                    lats.push(+i.houses[0].lat);
                    lngs.push(+i.houses[0].lng);
                  })
                  // const closestRightLat = Math.min(...lats.filter(v => v > +this.state.location.lat));
                  // const closestLeftLat = Math.max(...lats.filter(v => v < +this.state.location.lat));
                  // const closestRightLng = Math.min(...lngs.filter(v => v > +this.state.location.lon));
                  const closestLeftLng = Math.max(...lngs.filter(v => v < +this.state.location.lon));
                  this.state.geo_locations.forEach((i, id) => {
                    // console.log(i)
                        if (+i.houses[0].lng === closestLeftLng) {
                          this.setState({location_name: i.name});
                          this.setState({location_number: i.houses[0].house});
                          console.log(this.state.location_name)
                        }
                  })
                } else {
                  Alert.alert(this.state.lang_obj.locationNotSupport.title, this.state.lang_obj.locationNotSupport.body);
                  this.props.navigation.dispatch(StackActions.replace('MainOrder'));
                  return null;
                }
              }
            )
          }
        }
        // if (this.state.custom_location === undefined) {
        // }
        try {
          if (this.props.route.params.address.location.lat !== undefined) {
            const location = {
              lat: this.props.route.params.address.location.lat,
              lon: this.props.route.params.address.location.lng
            }
            this.setState({custom_location: location})
          }
        } catch (error) {

        }
        try {
          if (!this.props.route.params.firstAddress) {
            this.setState({checkboxValue: this.props.route.params.checkboxValue})
            this.setState({second_location_name: this.props.route.params.address.street});
            this.setState({second_number: this.props.route.params.address.house});
            let editAddr = this.props.route.params.address.street.slice(0, 18) + '... ' + this.props.route.params.address.house
            this.state.secondAddressText = editAddr
            this.setState({marker_color: '#009688'});
            this.setState(prevState => ({
              chooseAddr: {
                  ...prevState.chooseAddr,
                  borderColor: '#009688'
              }
            }))
            this.setState(prevState => ({
              appButtonContainerConfirm: {
                  ...prevState.appButtonContainerConfirm,
                  backgroundColor: '#009688'
              }
            }))
          } else {
            let editAddr = this.props.route.params.address.street + ' ' + this.props.route.params.address.house
            if (editAddr.length > 26) {
              editAddr = editAddr.slice(0, 26) + '...'
              this.setState({editAddressText: editAddr})
            } else {
              this.setState({editAddressText: editAddr})
            }
            this.setState({location_name: this.props.route.params.address.street});
            this.setState({location_number: this.props.route.params.address.house});
            this.setState(prevState => ({
              location: {
                  ...prevState.location,
                  lat: this.props.route.params.address.location.lat,
                  lon: this.props.route.params.address.location.lng,
              }
            }))
            console.log(this.state.location_name)
          }
        } catch (error) {
          // Alert.alert('Стоп!', 'Укажите адрес конечной точки!');
        }
    });
 }
  confirmOrder = async () => {
    if (this.props.route.params.driverTypeParam !== 'fullDay') {
      if(this.state.second_location_name === undefined || this.state.second_number === undefined) {
        return Alert.alert(this.state.lang_obj.cooseEndPoint);
      }
    }
    // console.log(this.state.location);
    console.log(this.state.location_name);
    if (this.props.route.params.driverTypeParam === 'fullDay') {
      this.state.tarriff_name = 'Драйвер на сутки'
      this.state.route_arr = [
        {
          name: this.state.location_name,
          lat: this.state.location.lat,
          lng: this.state.location.lon,
          number: this.state.location_number,
        }
      ]
    } else {
      this.state.tarriff_name = 'Драйвер'
      this.state.route_arr = [
        {
          name: this.state.location_name,
          lat: this.state.location.lat,
          lng: this.state.location.lon,
          number: this.state.location_number,
        },
        {
          name: this.state.second_location_name,
          number: this.state.second_number
        }
      ]
    }
    await axios.post('http://online.deluxe-taxi.kiev.ua:'+SyncStorage.get('port')+'/api/weborders/', 
        { 
          route_undefined: this.state.checkboxValue,
          reservation: false,
          user_phone: SyncStorage.get('phone'),
          route: this.state.route_arr,
          flexible_tariff_name: 'Драйвер',
          taxiColumnId: 0,
          params: this.state.tarriff_name,
          message: this.state.message,
        }, 
        {
          headers: {
            'sensetive': 'true',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': '', 
            'X-WO-API-APP-ID': '10999'
          },
        }
      )
      .then(data => {
        console.log(data);
        if (data.status === 200) {
          // if (SyncStorage.get('uid') !== undefined) {
            this.state.orderCost = data.data.dispatching_order_uid
            SyncStorage.set('uid', this.state.orderCost);
            SyncStorage.set('location', this.state.location);
            SyncStorage.set('orderCost', this.state.orderCost);
            SyncStorage.set('driverType', this.props.route.params.driverTypeParam);
            this.props.navigation.dispatch(StackActions.replace('OrderWait', {
              driverTypeParam: this.props.route.params.driverTypeParam,
              location: this.state.location,
              orderCost: this.state.orderCost,
            }));
          // }
        };
      });
  }
    searchScreen = () => {
      this.props.navigation.navigate('secondAdress');
    }
    _secondAddr = () => {
      if (this.state.secondAddressText !== undefined) {
        if (this.state.secondAddressText.length > 18) {
          let editAddr = this.props.route.params.address.street.slice(0, 18) + '... ' + this.props.route.params.address.house
          this.state.secondAddressText = editAddr
        }
      }
      if (this.props.route.params.driverTypeParam !== 'fullDay') {
        return (
          <View style={styles.TextAreaView}>
          <View>
            <Text style={styles.MessageTitle}>{this.state.lang_obj.whereTo}</Text>
          </View>
          <TouchableOpacity onPress={this.searchScreen}>
            <View style={this.state.chooseAddr}>
              <AntDesign name="enviromento" size={24} color={this.state.marker_color} />
              <Text style={{color: "white", fontFamily: 'serif'}}>{this._renderSecondAddress()}</Text>
            </View>
          </TouchableOpacity>
          </View>
        )
      }
      return null;
    }
    editAddress = () => {
      this.props.navigation.navigate('secondAdress', {firstAddress: true})
    }
    _MapController = () => {
      console.log(this.state.street)
      return  (
        <View>
          <Map height={200} width={350} location={this.state.location} location_name={this.state.location_name} location_number={this.state.location_number} enableLocation={false} />
        </View>
      )
    }
    _renderSecondAddress() {
      if (this.state.secondAddressText === undefined) {
        return this.state.lang_obj.secondAddressText
      } else {
        return this.state.secondAddressText
      }
    }
    render() {
      const windowWidth = Dimensions.get('window').width;
      const windowHeight = Math.round(Dimensions.get('window').height);
      let style = {backgroundColor: '#000'}
      if (windowHeight < 760) {
        style = {backgroundColor: '#000'}
      } else {
        style = {height: windowHeight,backgroundColor: '#000'}
      }
      return (
        <ScrollView style={{height: windowHeight, backgroundColor: '#000'}}>
        {/* <KeyboardAvoidingView style={{height: windowHeight, flex: 1, backgroundColor: '#000'}}> */}
        <View style={style}>
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
        <View style={styles.MainReview}>
          <View style={styles.OrderView}>
            <View>
              <Text style={this.state.appButtonText}>{this.state.tariffs.title}</Text>
            </View>
            <View>
            </View>
          </View>
          <View>
              <Text style={styles.MessageTitle}>{this.state.lang_obj.weFindYou}</Text>
          </View>
          <TouchableOpacity onPress={this.editAddress}>
            <Text style={styles.EditAddrText}>{this.state.lang_obj.editAddressText}</Text>
          </TouchableOpacity>
          <View style={{marginBottom: '10%'}}>
            {this._MapController()}
          </View>
          {this._secondAddr()}
          <View style={styles.TextAreaView}>
              <View>
                <Text style={styles.MessageTitle}>{this.state.lang_obj.messageOrderText}</Text>
              </View>
              <View>
                <TextInput
                    numberOfLines={10}
                    style={styles.textArea}
                    placeholder={this.state.lang_obj.messageOrderPlaceholder}
                    onChangeText={(message) => this.setState({message})}
                />
              </View>
          </View>
          <View>
            <TouchableOpacity style={this.state.appButtonContainerConfirm} onPress={this.confirmOrder}>
                <Text style={this.state.appButtonText}>{this.state.lang_obj.btnconfirm}</Text>
            </TouchableOpacity>
          </View>
          </View>
        {/* </ScrollView> */}
        {/* </KeyboardAvoidingView> */}
        </View>
        </ScrollView>
      )
    }
  }