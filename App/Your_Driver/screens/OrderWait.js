import React, { Component } from 'react'
import styles from '../Styles'
import {View, Text, Button, Alert, TouchableOpacity, Linking} from 'react-native'
import SyncStorage from 'sync-storage';
import { Map } from './Map'
import axios from 'axios';
import {StackActions} from '@react-navigation/native'; 
import {Logo} from '../Logo';
import * as ru from '../langs/ru.json';
import * as uk from '../langs/uk.json';
import * as en from '../langs/en.json';
import Flag from 'react-native-flags';

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
        elevation: 8, 
        backgroundColor: "#ffac33",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 5,
      },
      btnDisableOrder: {
        elevation: 8, 
        backgroundColor: "#ef5350",
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
    if (this.props.route.params.driverTypeParam === 'fullDay') {
      // this.state.orderBtnText = this.state.lang_obj.searchFullDayDriver;
      this.state.appButtonText.fontSize = 15;
    } else {
      // this.state.orderBtnText = this.state.lang_obj.searchDriver;
    }
    this.state.location = this.props.route.params.location;
    this.state.orderCost = this.props.route.params.orderCost;
    this.state.orderBtnText = this.state.lang_obj.searchDriver;
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
  disableOrder = () => {
    const url = 'http://online.deluxe-taxi.kiev.ua:9050/api/weborders/cancel/' + this.state.orderCost;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic YWNod...YQ==',
      }
    })
    .then(data => {
      // if (data.status === 200) {
        this.state.flagWhile = false;
        this.props.navigation.dispatch(StackActions.replace('MainOrder'));
      // }
    })
    .catch(error => {
      console.log(error);
    });
    console.log(url);
  }
    render() {
      function wait(ms) {
        return new Promise(r => setTimeout(r, ms));
      }
      const hello = async () => {
        while(this.state.flagWhile) {
          axios.get('http://online.deluxe-taxi.kiev.ua:9050/api/weborders/' + SyncStorage.get('uid'), {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Basic YWNod...YQ==',
            }
          })
          .then(data => {
            console.log(SyncStorage.get('uid'));
            if (data.data.driver_phone) {
              this.state.flagWhile = false;
              this.state.orderBtnText = this.state.lang_obj.driverIsFound;
              this.setState({driver_phone: data.data.driver_phone});
              console.log(this.state.driver_phone);
              return null;
            } else {
              console.log('Driver not found');
              // this.setState({driver_phone: '380661394160'});
            }
            // this.state.btnDisableOrder.backgroundColor = '#009688';
          });
          await wait(20000);
        };
      }
      hello();
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
                <TouchableOpacity onPress={this.disableOrder} style={this.state.btnDisableOrder}>
                  <Text style={styles.appButtonText}>{this.state.lang_obj.disableOrderBtn}</Text>
                </TouchableOpacity>
                <View style={this.state.appButtonContainer}>
                  <Text style={this.state.appButtonText}>{this.state.lang_obj.searchDriver}</Text>
                </View>
                <View>
                  <Text style={this.state.appButtonText}>{this.state.driver_phone}</Text>
                </View>
              </View>
            </View>
            {/* <Text style={styles.linkSi  te}  onPress={() => (Linking.openURL('http://yourdriver.cc.ua/'))}>yourdriver.cc.ua</Text> */}
          </View>
          <View> 
            <Map location={this.state.location} enableLocation={true} />
          </View>
          <View>
            <View style={styles.Phones}>
              <Text style={styles.HelpText}>{this.state.lang_obj.geoProblemPermission}</Text>
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