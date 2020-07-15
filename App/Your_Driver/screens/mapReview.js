import React, { Component } from 'react'
import styles from '../Styles'
import {View, Text, ActivityIndicator, Alert, TouchableOpacity, Linking} from 'react-native'
import SyncStorage from 'sync-storage';
import { Map } from './Map'
import axios from 'axios';
import {StackActions} from '@react-navigation/native'; 
import {Logo} from '../Logo';
import * as ru from '../langs/ru.json';
import * as uk from '../langs/uk.json';
import * as en from '../langs/en.json';
import Flag from 'react-native-flags';

export class MapReview extends Component {
  constructor(props){
    super(props)
    this.state = {
      location: {},
      lang_obj: {},
      location_name: '',
      geo_locations: {},
      appButtonContainer: {
        elevation: 8, 
        backgroundColor: "#ffac33",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 5,
      },
      appButtonContainerConfirm: {
        elevation: 8, 
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 5,
      },
      orderCost: '',
      appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      },
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
    });
 }
 reLocate = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      let lon = position['coords']['longitude'];
      let lat = position['coords']['latitude'];
      const location = {
        lon: lon,
        lat: lat,
      }
      this.state.location = location;
      Alert.alert('Data: ', 'lon ' + lon + ' lat ' + lat);
      this.props.navigation.navigate('MapReview', {
        driverTypeParam: driverType,
        location: this.state.location,
        orderCost: this.state.orderCost,
      });
    },
    error => {
      console.log(error);
      Alert.alert(this.state.lang_obj.errors.geoError.name, this.state.lang_obj.errors.geoError.body)
    },
    { maximumAge: 0 },
  );
 }
  confirmOrder = async () => {
    await axios.get('http://online.deluxe-taxi.kiev.ua:9050/api/geodata/search?lat='+this.state.location.lat+'&lng='+this.state.location.lon+'&r=100', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic YWNod...YQ==',
      }
    })
    .then( data => {
        // data = JSON.parse(data);
        console.log(data);
        // this.state.location_name = data.data.geo_streets.geo_street[0].name + data.data.geo_streets.geo_street[0].houses[0].house;
        this.state.geo_locations = data.data.geo_streets.geo_street;
        // this.state.location.lat = data.data.geo_streets.geo_street[0].houses[0].lat;
        // this.state.location.lon = data.data.geo_streets.geo_street[0].houses[0].lng;
        // console.log(this.state.location_name);
        // console.log(data);
        console.log(this.state.location);
        let lats = [];
        let lngs = [];
        this.state.geo_locations.forEach((i) => {
          lats.push(+i.houses[0].lat);
          lngs.push(+i.houses[0].lng);
        })
        const closestRightLat = Math.min(...lats.filter(v => v > +this.state.location.lat));
        const closestLeftLat = Math.max(...lats.filter(v => v < +this.state.location.lat));
        const closestRightLng = Math.min(...lngs.filter(v => v > +this.state.location.lon));
        const closestLeftLng = Math.max(...lngs.filter(v => v < +this.state.location.lon));
    
      // if (closestRightLat > +this.state.location.lat && +this.state.location.lat > closestLeftLat && closestRightLng > +this.state.location.lat && +this.state.location.lat > closestLeftLng) {
        this.state.geo_locations.forEach((i, id) => {
          // if (+i.houses[0].lat == this.state.location.lat && +i.houses[0].lng == this.state.location.lon) {
            // if (+i.houses[0].lat > closestRightLat && +i.houses[0].lat < closestLeftLat && +i.houses[0].lng > closestRightLng && +i.houses[0].lng < closestRightLng) {
              if (+i.houses[0].lng === closestLeftLng)
              this.setState({location_name: i.name});
              this.setState({location_number: i.houses[0].house});
              console.log(this.state.location_name)
            // }
          // }
        })
      // }
      }
      // .catch(error => {
      //   console.log(error);
      // });
    )

    await axios.post('http://online.deluxe-taxi.kiev.ua:9050/api/weborders/', 
        { 
          reservation: false,
          user_full_name: "Влад Думанский",
          user_phone: "380661394160",
          route: [{
            name: this.state.location_name,
            lat: this.state.location.lat,
            lng: this.state.location.lon,
            number: this.state.location_number,
          }],
          route_undefined: false,
          flexible_tariff_name: 'Стандарт',
          taxiColumnId: 0,
          params: 'тест1',
        }, 
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': '', 
            'Authorization': 'Basic YWNod...YQ==',
            'X-WO-API-APP-ID': '10999'
          },
        }
      )
      .then(data => {
        console.log(data);
        if (data.status === 200) {
          if (SyncStorage.get('uid') !== '' || SyncStorage.get('uid') !== undefined) {
            this.state.orderCost = data.data.dispatching_order_uid
            SyncStorage.set('uid', this.state.orderCost);
            // console.log(JSON.);
            console.log('---------------------');
            this.props.navigation.dispatch(StackActions.replace('OrderWait', {
              driverTypeParam: this.props.route.params.driverTypeParam,
              location: this.props.route.params.location,
              orderCost: this.state.orderCost,
            }));
          }
        };
      });
  }
    render() {
      const MAP = <Map location={this.state.location} enableLocation={false} />
      return (
        <View style={styles.Main}>
                <View>
                    <Logo />
                    <View onPress={() => this.setState({lang_obj: ru})} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                        <TouchableOpacity onPress={() => {
                            this.setState({lang_obj: ru});
                            SyncStorage.set('lang', 'ru')
                        }}>
                            <Flag 
                                code="RU"
                                size={48}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({lang_obj: uk});
                            SyncStorage.set('lang', 'uk')
                        }}>
                            <Flag
                                code="UA"
                                size={48}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({lang_obj: en});
                            SyncStorage.set('lang', 'en')
                        }}>
                            <Flag
                                code="US"
                                size={48}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
          <View style={styles.OrderView}>
            <View>
              <View style={styles.orderBtns}>
                {/* <TouchableOpacity style={this.state.appButtonContainer} onPress={this.disableOrder}> */}
                {/* <Text style={this.state.appButtonText}>Проверьте своё местоположение</Text> */}
                {/* </TouchableOpacity> */}
                {/* <Text style={this.state.appButtonText}>{this.state.orderCost}</Text> */}
              </View>
            </View>
            {/* <Text style={styles.linkSite}  onPress={() => (Linking.openURL('http://yourdriver.cc.ua/'))}>yourdriver.cc.ua</Text> */}
          </View>
          <View>
            {MAP}
          </View>
          <View>
            {/* <TouchableOpacity style={this.state.appButtonContainer} onPress={this.reLocate}>
                <Text style={this.state.appButtonText}>Переопределить</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={this.state.appButtonContainerConfirm} onPress={this.confirmOrder}>
                <Text style={this.state.appButtonText}>{this.state.lang_obj.btnconfirm}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }