import React, { Component } from 'react';
import * as Font from 'expo-font';
import styles from '../Styles';
import {View, Text, ScrollView, Alert,Image, TextInput, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainOrder } from './MainOrder'
import SyncStorage from 'sync-storage';
import axios from 'axios';
import * as Crypto from 'expo-crypto'
import * as ru from '../langs/ru.json';
import * as uk from '../langs/uk.json';
import * as en from '../langs/en.json';
import { Dimensions } from 'react-native';
import {Logo} from '../Logo';
import {StackActions} from '@react-navigation/native'; 

export class SignIn extends Component {
    state = {
        login: '',
        password: '',
        lang_obj: {},
    }
    componentDidMount() {
        // this.props.navigation.dispatch(StackActions.replace('MainOrder'));
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
    cryptoPass = async () => {
        const digest = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA512,
            this.state.password
        )
        this.state.password = await digest;
    }
    setLang(lang) {
        this.state.lang_obj = lang;
        SyncStorage.set('lang', lang.lang)
    }
    LoginBtn = async () => {
        if (this.state.password === '' || this.state.phone === '') {
            Alert.alert(this.state.lang_obj.errors.minus2.name, this.state.lang_obj.errors.minus2.body, [{text: 'OK'}]);
            return null
        }
        await this.cryptoPass();
        console.log(await this.state.password);
        await axios.post('http://online.deluxe-taxi.kiev.ua:9050/api/account/', 
        {
            Login: this.state.phone,
            Password: this.state.password,
        },
        {
            method: "POST",
            url: "http://online.deluxe-taxi.kiev.ua:9050/api/account/",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': '', 
                'X-WO-API-APP-ID': '10999'
            },
          })
          .then(data => {
            console.log(data);
            if (data.status === 200) {
                SyncStorage.set('phone', this.state.phone);
                this.props.navigation.dispatch(StackActions.replace('MainOrder'));
            }
            // if (data.Id === -2) {
            //     // console.log(error);
            //     Alert.alert(this.state.lang_obj.errors.minus2.name, this.state.lang_obj.errors.minus2.body, [{text: 'OK'}])
            // }
          })
          .catch(error => {
                // console.log(error);
                Alert.alert(this.state.lang_obj.errors.minus2.name, this.state.lang_obj.errors.minus2.body, [{text: 'OK'}]);
          })
    }
    render() {
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
            <View style={styles.MainLogin}>
                <View style={styles.inputsView}>
                    <TextInput
                        style={styles.input}
                        placeholder={this.state.lang_obj.phone}
                        onChangeText={(phone) => this.setState({phone})}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={this.state.lang_obj.password}
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({password})}
                    />
                    <View style={styles.btnLog}>
                        <TouchableOpacity onPress={this.LoginBtn} style={styles.appButtonContainer}>
                            <Text style={styles.appButtonText}>{this.state.lang_obj.signin_btn}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.authRoutes}>
                    <Text style={styles.routesTexts} onPress={() => {this.props.navigation.navigate('SignUp', {'foo': 'bar'})}}>{this.state.lang_obj.register}</Text>
                    <Text style={styles.routesTexts} onPress={() => {this.props.navigation.navigate('ResetPassword')}}>{this.state.lang_obj.reset_pass}</Text>
                </View>
            </View>
            </View>
            </ScrollView>
        )
    }
}