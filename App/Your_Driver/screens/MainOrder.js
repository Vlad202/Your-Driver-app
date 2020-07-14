import React, { Component } from 'react'
import styles from '../Styles'
import {View, Text, Button, Alert, TouchableOpacity, Linking} from 'react-native'
import SyncStorage from 'sync-storage';
import {StackActions} from '@react-navigation/native'; 
import axios from 'axios';
import {Logo} from '../Logo';
import * as ru from '../langs/ru.json';
import * as uk from '../langs/uk.json';
import * as en from '../langs/en.json';
import Flag from 'react-native-flags';

export class MainOrder extends Component {
    constructor(props){
      super(props)
      this.state = {
        lang_obj: {},
        location: {},
        appButtonContainer: {
          elevation: 8, 
          backgroundColor: "#009688",
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 12,
          margin: 5,
        },
        order: '',
      }
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
      navigator.geolocation.getCurrentPosition(
        position => {
          let lon = position['coords']['longitude'];
          let lat = position['coords']['latitude'];
        },
        error => {
          Alert.alert('Упс... Не удалось узнать ваше местоположение', 'Пожалуйста, дайте приложению доступ к Вашей геолокации.')
        },
        { maximumAge: 0 },
      );
    }
    orderRequest = () => {
      axios.get('http://cors-test.appspot.com/test')
        .then(data => {
          if (data.status === 200) Alert.alert('Data', data);
        })
        .then(error => {
          console.log(error);
        })
    }
    findCords = (driverType) => {
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
          Alert.alert(this.state.lang_obj.errors.geoError.name, this.state.lang_obj.errors.geoError.body)
        },
        { maximumAge: 0 },
      );
    }
    fullDayOrder = () => {
      this.findCords('fullDay');
    }
    driverOrder = () => {
      this.findCords('driver');
    }
    render() {
      return (
        <View style={styles.Main}>
                <View>
                    <Logo />
                    <View onPress={() => this.setState({lang_obj: ru})} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity onPress={() => {
                            this.setState({lang_obj: ru});
                            SyncStorage.set('lang', 'ru')
                        }}>
                            <Flag 
                                code="RU"
                                size={64}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({lang_obj: uk});
                            SyncStorage.set('lang', 'uk')
                        }}>
                            <Flag
                                code="UA"
                                size={64}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({lang_obj: en});
                            SyncStorage.set('lang', 'en')
                        }}>
                            <Flag
                                code="US"
                                size={64}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
          <View style={styles.OrderView}>
            <View style={{width: '60%'}}>
              <View style={styles.orderBtns}>
                <TouchableOpacity onPress={(this.fullDayOrder)} style={this.state.appButtonContainer}>
                  <Text style={styles.appButtonText}>{this.state.lang_obj.oneDayDriverBtn}</Text>
                </TouchableOpacity>
                <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                      {/* <Text style={styles.tarifs}>{this.state.lang_obj.tariffs.fullDay}</Text> */}
                </View>
                <TouchableOpacity onPress={(this.driverOrder)} style={this.state.appButtonContainer}>
                  <Text style={styles.appButtonText}>{this.state.lang_obj.driverBtn}</Text>
                </TouchableOpacity>
                <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
                  {/* <Text style={styles.tarifs}>{this.state.lang_obj.tariffs.one}</Text>
                  <Text style={styles.tarifs}>{this.state.lang_obj.tariffs.two}</Text>
                  <Text style={styles.tarifs}>{this.state.lang_obj.tariffs.three}</Text> */}
                </View>
              </View>
            </View>
            <Text style={styles.linkSite}  onPress={() => (Linking.openURL('http://yourdriver.cc.ua/'))}>yourdriver.cc.ua</Text>
          </View>
          <View>
            <View style={ styles.Phones}>
              <View style={styles.HelpTextView}>
                <Text style={styles.HelpText}>{this.state.lang_obj.geoProblemPermission}</Text>
              </View>
              <View style={styles.PhoneNumbers}>
                <Text style={styles.PriceText} onPress={() => (Linking.openURL('tel:380675999662'))}>+38 (067)-5-999-662</Text>
                <Text style={styles.PriceText} onPress={() => (Linking.openURL('tel:380635999662'))}>+38 (063)-5-999-662</Text>
                <Text style={styles.PriceText} onPress={() => (Linking.openURL('tel:380505999662'))}>+38 (050)-5-999-662</Text>
              </View>
            </View>
          </View>
        </View>
      )
    }
  }