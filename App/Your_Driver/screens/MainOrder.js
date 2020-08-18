import React, { Component } from 'react'
import styles from '../Styles'
import {View, Text, Image, Alert, TouchableOpacity, KeyboardAvoidingView, ScrollView, Linking} from 'react-native'
import SyncStorage from 'sync-storage';
import {StackActions} from '@react-navigation/native'; 
import axios from 'axios';
import {Logo} from '../Logo';
import * as ru from '../langs/ru.json';
import * as uk from '../langs/uk.json';
import * as en from '../langs/en.json';
import Flag from 'react-native-flags';
import { AntDesign } from '@expo/vector-icons'; 
import { Dimensions } from 'react-native';

export class MainOrder extends Component {
    constructor(props){
      super(props)
      this.state = {
        lang_obj: {},
        location: {},
        appButtonContainer: {
          marginBottom: 5,
          marginTop: 20,
          elevation: 8, 
          backgroundColor: "#009688",
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 12,
          margin: 5,
        },
        appButtonContainerDriver: {
          elevation: 8, 
          backgroundColor: "#009688",
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 12,
          margin: 5,
        },
        order: '',
        chooseAddr: {
          padding: 8,
          width: '40%',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'row',
          borderWidth: 3,
          borderColor: '#ffac33',
          borderRadius: 15
        },
        marker_color: "#ffac33",
      }
      this.state.city = this.state.lang_obj.yourCity
    }
    componentDidMount() {
      if (SyncStorage.get('uid') !== undefined) {
        this.props.navigation.dispatch(StackActions.replace('OrderWait', {
          driverTypeParam: SyncStorage.get('driverType'),
          location: SyncStorage.get('location'),
          orderCost: SyncStorage.get('orderCost'),
        }));
      }
      this.props.navigation.addListener('focus', () => {
        if (SyncStorage.get('lang') == undefined) {
            SyncStorage.set('lang', 'uk');
        }
        if (SyncStorage.get('lang') === 'ru') {
            this.setState({lang_obj: ru});
            this.state.city = this.state.lang_obj.yourCity
        }
        if (SyncStorage.get('lang') === 'uk') {
            this.setState({lang_obj: uk});
            this.state.city = this.state.lang_obj.yourCity
        }
        if (SyncStorage.get('lang') === 'en') {
            this.setState({lang_obj: en});
            this.state.city = this.state.lang_obj.yourCity
        }
        this.state.city = this.state.lang_obj.yourCity
        try {
          this.setState({city: this.props.route.params.city.slice(0, 16) + '...'})
          this.setState({city_name: this.props.route.params.city})
          this.setState({port: this.props.route.params.port})
          // SyncStorage.set('port', this.state.port)
          console.log(SyncStorage.get('port'))
        } catch(error) {
            this.setState({city: this.state.lang_obj.city})
        } 
        if (SyncStorage.get('port') !== undefined) {
          this.setState({city: SyncStorage.get('city')})
        } else {
          this.setState({city: this.state.lang_obj.city})
        }
    });
      navigator.geolocation.getCurrentPosition(
        position => {
          let lon = position['coords']['longitude'];
          let lat = position['coords']['latitude'];
        },
        error => {
          Alert.alert(this.state.lang_obj.errors.geoError.name, this.state.lang_obj.errors.geoError.body)
        },
        { maximumAge: 0 },
      );
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
          // Alert.alert('Data: ', 'lon ' + lon + ' lat ' + lat);
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
      if (SyncStorage.get('port') !== undefined) {
        this.findCords('fullDay');
      } else {
        Alert.alert(this.state.lang_obj.choose_start_place)
      }
    }
    driverOrder = () => {
      if (SyncStorage.get('port') !== undefined) {
        this.findCords('driver');
      } else {
        Alert.alert(this.state.lang_obj.choose_start_place)
      }
    }
    _tariffsDriver () {
      if (!this.state.flagTariffs) {
          axios.get('http://yourdriver.cc.ua/JS/rates.json')
        .then(data => {
          // if (data.status === 200) {
            // console.log(data);
            this.setState({dataTariffs: data.data});
            this.setState({flagTariffs: true});
            // }
        })
      }
      if (this.state.flagTariffs) {
        let arr = this.state.tariffsFull
        let lang = SyncStorage.get('lang');
        if (lang === 'ru') {
          return (
            <View style={{marginLeft: '15%', marginRight: '3%'}}>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.ru.fullDay[0]}</Text>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.ru.fullDay[1]}</Text>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.ru.fullDay[2]}</Text>
            </View>
          )
        }
        if (lang === 'uk') {
          return (
            <View style={{ marginLeft: '15%', marginRight: '3%'}}>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.uk.fullDay[0]}</Text>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.uk.fullDay[1]}</Text>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.uk.fullDay[2]}</Text>
            </View>
          )
        }
        if (lang === 'en') {
          return (
            <View style={{ marginLeft: '15%', marginRight: '3%'}}>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.en.fullDay[0]}</Text>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.en.fullDay[1]}</Text>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.en.fullDay[2]}</Text>
            </View>
          )
        }
      }
    }
    _tariffsFull () {
      if (this.state.flagTariffs) {
        let arr = this.state.tariffsFull;
        let lang = SyncStorage.get('lang');
        if (lang === 'ru') {
          return (
            <View style={{marginLeft: '15%', marginRight: '3%'}}>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.ru.Driver[0]}</Text>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.ru.Driver[1]}</Text>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.ru.Driver[2]}</Text>
            </View>
          )
        }
        if (lang === 'uk') {
          return (
            <View style={{marginLeft: '15%', marginRight: '3%'}}>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.uk.Driver[0]}</Text>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.uk.Driver[1]}</Text>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.uk.Driver[2]}</Text>
            </View>
          )
        }
        if (lang === 'en') {
          return (
            <View style={{marginLeft: '15%', marginRight: '3%'}}>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.en.Driver[0]}</Text>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.en.Driver[1]}</Text>
              <Text style={{fontFamily: 'serif', color: 'white'}}>{this.state.dataTariffs.en.Driver[2]}</Text>
            </View>
          )
        }
      }
    }
    searchScreen = () => {
      this.props.navigation.navigate('Cities')
    }
    linkingApp = () => {
      Linking.canOpenURL("tg://app").then(supported => {
        if (supported) {
          Linking.openURL("fb://app");
        } else {
          Linking.openURL("https://play.google.com/store/apps/details?id=com.facebook.katana&hl=ru");
        }
      });
    }
    render() {
      if (SyncStorage.get('port') !== undefined) {
        this.state.city = SyncStorage.get('city')
      } else {
        this.state.city = this.state.lang_obj.yourCity
      }
      
      const windowWidth = Dimensions.get('window').width;
      const windowHeight = Math.round(Dimensions.get('window').height);
      return (

        <ScrollView style={{height: windowHeight, backgroundColor: '#000'}}>
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
        <View style={styles.MainLogin}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                      <Text style={styles.helloText}>{this.state.lang_obj.helloText}</Text>
                    </View>
          <View style={styles.TextAreaView}>
            <View style={{marginTop: '5%'}}>
              <Text style={styles.MessageTitle}>{this.state.lang_obj.yourCity}</Text>
            </View>
            <TouchableOpacity onPress={this.searchScreen}>
              <View style={this.state.chooseAddr}>
                <AntDesign name="enviromento" size={24} color={this.state.marker_color} />
                  <Text style={{color: "white", fontFamily: 'serif'}}>{this.state.city}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.OrderView}>
            <View style={{width: '60%'}}>
              <View style={styles.orderBtns}>
                <TouchableOpacity onPress={(this.fullDayOrder)} style={this.state.appButtonContainer}>
                  <Text style={styles.appButtonTextFullDay}>{this.state.lang_obj.oneDayDriverBtn}</Text>
                </TouchableOpacity>
                {this._tariffsDriver()}
                <TouchableOpacity onPress={(this.driverOrder)} style={this.state.appButtonContainerDriver}>
                  <Text style={styles.appButtonText}>{this.state.lang_obj.driverBtn}</Text>
                </TouchableOpacity>
                {this._tariffsFull()}
              </View>
            </View>
            <View style={{borderWidth: 2, borderBottomColor: '#3d63db'}}>
              <Text style={styles.linkApp} onPress={() => this.linkingApp()}>
                  {this.state.lang_obj.get_taxi}
              </Text>
            </View>
            <Text style={styles.linkSite} onPress={() => (Linking.openURL('http://http://yourdriver.cc.ua/'))}>YourDriver.cc.ua</Text>
          </View>
          <View style={styles.HelpTextView}>
                <Text style={styles.TextErrHelp}>{this.state.lang_obj.geoProblemPermission}</Text>
              </View>
          <View>
            <View style={ styles.Phones}>
            <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: 10}}>
                    <Image 
                        style={{width: 30, height: 30}}
                        source={require('../socialImages/telegram.png')}
                    />
                  </View>
                  <View style={{marginRight: 10}}>
                    <Image 
                        style={{width: 30, height: 30}}
                        source={require('../socialImages/viber.png')}
                    />
                  </View>
                    <View style={{marginRight: 10}}>
                      <Image 
                          style={{width: 30, height: 30}}
                          source={require('../socialImages/whatsapp.png')}
                      />
                    </View>
                </View>
              <View style={styles.PhoneNumbers}>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                  <View>
                    <Text style={styles.PriceText} onPress={() => (Linking.openURL('tel:380675999662'))}>+38 (067)-5-999-662</Text>                  
                  </View>
                </View>
                <View  style={{flexDirection: 'row', marginBottom: 10}}>
                  <View>
                    <Text style={styles.PriceText} onPress={() => (Linking.openURL('tel:380635999662'))}>+38 (063)-5-999-662</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                  <View>
                    <Text style={styles.PriceText} onPress={() => (Linking.openURL('tel:380505999662'))}>+38 (050)-5-999-662</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        </ScrollView>
      )
    }
  }