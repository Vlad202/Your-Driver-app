import React, { Component } from 'react'
import * as Font from 'expo-font';
import styles from '../Styles'
import {View, Text, Image, Alert, CheckBox, TouchableOpacity, ScrollView} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainOrder } from './MainOrder'
import SyncStorage from 'sync-storage';
import axios from 'axios';
import {Logo} from '../Logo';
import * as ru from '../langs/ru.json';
import * as uk from '../langs/uk.json';
import * as en from '../langs/en.json';
import Flag from 'react-native-flags';
import DelayInput from "react-native-debounce-input";
import { AntDesign } from '@expo/vector-icons'; 
import CheckboxFormX from 'react-native-checkbox-form';
import { Dimensions } from 'react-native';

export class secondAdress extends Component {
    state = {
        confirm_code: '',
        lang_obj: {},
        message: '',
        items: [],
        checkboxValue: false,
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
            try {
                this.setState({firstAddress: this.props.route.params.firstAddress})
            } catch (error) {
                this.setState({firstAddress: false})
            }
            try {
                this.setState({city: this.props.route.params.city.slice(0, 16) + '...'})
                this.setState({city_name: this.props.route.params.city})
                this.setState({city_port: this.props.route.params.port})
            } catch(error) {
                this.setState({city: 'Выбрать город'})
            } 
            try {
                this.setState({street: this.props.route.params.name.slice(0, 16) + '...'})
                this.setState({street_name: this.props.route.params.name})
            } catch(error) {
                this.setState({street: this.state.lang_obj.choose_street})
            } 
            try {
                this.setState({house: this.props.route.params.house.slice(0, 16)})
                this.setState({house_name: this.props.route.params.house})
                this.setState({lat: this.props.route.params.lat})
                this.setState({lng: this.props.route.params.lng})
            } catch(error) {
                this.setState({house: this.state.lang_obj.choose_house})
            } 
        });
        axios.get('http://online.deluxe-taxi.kiev.ua:'+SyncStorage.get('port')+'/api/geodata/streets/search?q=А&limit=30')
        .then(data => {
            this.setState({data: data.data});    
        })
     }
    searchCity = () => {
        this.props.navigation.navigate('SearchCity');
    }
    searchStreet = () => {
        if (this.state.city_name !== undefined) {
            this.props.navigation.navigate('SearchStreet', {city: this.state.city_name, port: this.state.city_port});
        } else {
            this.props.navigation.navigate('SearchStreet', {city: this.state.city_name, port: this.state.city_port, firstAddress: true});
        }
    }
    searchHouse = () => {
        
        if (this.state.street_name !== undefined) {
            if (this.state.firstAddress) {
                this.props.navigation.navigate('SearchHouse', {
                    street: this.state.street_name,
                    port: this.state.city_port,
                    firstAddress: true
                });
            } else {
                this.props.navigation.navigate('SearchHouse', {
                    street: this.state.street_name,
                    port: this.state.city_port
                });
            }
        } else {
                Alert.alert('Выберите город и улицу!')
        }
    }
    confirmAddress = () => {
        if (this.state.street_name !== undefined && this.state.house_name !== undefined) {
            console.log(this.state.street)
            this.props.navigation.navigate('MapReview', {
                firstAddress: this.state.firstAddress,
                secondAdress: true,
                checkboxValue: this.state.checkboxValue,
                address: {
                    street: this.state.street_name,
                    house: this.state.house_name,
                    location: {
                        lat: this.state.lat,
                        lng: this.state.lng
                    },
                }
            })
        } else {
            Alert.alert(this.state.lang_obj.errors.chooseEndPointErr.name, this.state.lang_obj.errors.chooseEndPointErr.body)
        }
    }
    _renderAnyStreet() {
        if (this.state.street === undefined) {
            return this.state.lang_obj.choose_street
        } else {
            return this.state.street
        }
    }
    _renderAnyHouse() {
        if (this.state.street === undefined) {
            return this.state.lang_obj.choose_house
        } else {
            return this.state.house
        }
    }
    setSelection = () => {
        if (this.state.checkboxValue) {
            this.setState({checkboxValue: false})
        } else {
            this.setState({checkboxValue: true})
        }
    }
    renderCheckBox = () => {
        if (this.state.firstAddress) {
            return (
                <View style={{flexDirection: 'row', width: '50%', justifyContent: 'space-around'}}>
                <View>
                <CheckBox 
                    value={this.state.checkboxValue}  
                    onValueChange={() => this.setSelection()}
                    tintColors={{ true: '#009688', false: '#ffac33' }}
                />
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text onPress={() => this.setSelection()} style={styles.MessageTitle}>{this.state.lang_obj.on_city}</Text>
                </View>
            </View>
            )
        } else {
            return null;
        }
    }
    render() {
        const windowWidth = Dimensions.get('window').width;
        const windowHeight = Math.round(Dimensions.get('window').height);
        return (
            <ScrollView style={{height: windowHeight, backgroundColor: '#000'}}>
            <View style={{backgroundColor: '#000'}}>
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
            <View style={{marginTop: '20%', height: '100%', alignItems: 'center'}}>
            <View style={{marginTop: '10%'}}>
                <View style={styles.TextAreaView}>
                    <View style={styles.TextAreaView}>
                        <View>
                    <Text style={styles.MessageTitle}>{this.state.lang_obj.street}</Text>
                        </View>
                        <TouchableOpacity onPress={this.searchStreet}>
                            <View style={{padding: 10, width: '60%',justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', borderWidth: 3, borderColor: '#333', borderRadius: 15}}>
                            <AntDesign name="enviromento" size={24} color="#999" />
                                <Text style={{color: "white", fontFamily: 'serif'}}>{this._renderAnyStreet()}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{marginTop: '2%'}}>
                <View style={styles.TextAreaView}>
                    <View style={styles.TextAreaView}>
                        <View>
                            <Text style={styles.MessageTitle}>{this.state.lang_obj.house}</Text>
                        </View>
                        <TouchableOpacity onPress={this.searchHouse}>
                            <View style={{padding: 10, width: '60%',justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', borderWidth: 3, borderColor: '#333', borderRadius: 15}}>
                            <AntDesign name="enviromento" size={24} color="#999" style={{justifyContent: 'center', alignItems: 'center'}}/>
                                <Text style={{color: "white", fontFamily: 'serif'}}>{this._renderAnyHouse()}</Text>
                            </View> 
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {this.renderCheckBox()}
            <View style={{marginTop: '10%'}}>
                <TouchableOpacity style={styles.appButtonContainer} onPress={this.confirmAddress}>
                    <Text style={styles.appButtonText}>{this.state.lang_obj.btnconfirm}</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        </ScrollView>
        )
    }
}