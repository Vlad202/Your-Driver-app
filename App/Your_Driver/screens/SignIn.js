import React, { Component } from 'react'
import * as Font from 'expo-font';
import styles from '../Styles'
import {View, Text, Button, Alert, TextInput, TouchableOpacity} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainOrder } from './MainOrder'
import SyncStorage from 'sync-storage';
import axios from 'axios';
import * as Crypto from 'expo-crypto'
import * as ru from '../langs/ru.json';
import * as uk from '../langs/uk.json';
import * as en from '../langs/en.json';
import Flag from 'react-native-flags';
import {Logo} from '../Logo';

export class SignIn extends Component {
    state = {
        login: '',
        password: '',
        lang_obj: {},
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
    cryptoPass = async () => {
        const digest = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            this.state.password
        )
        this.state.password = await digest;
    }
    setLang(lang) {
        this.state.lang_obj = lang;
        SyncStorage.set('lang', lang.lang)
        // console.log(lang);
    }
    LoginBtn = async () => {
        await this.cryptoPass();
        console.log(await this.state.password);
        await axios.post('http://online.deluxe-taxi.kiev.ua:9050/api/account', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': '', 
                'Authorization': 'Basic YWNod...YQ==',
                'X-WO-API-APP-ID': '10999'
            },
            data: {
              phone: this.state.phone,
              password: this.state.password,
            }
          })
          .then(data => {
            if (data.status === 200) {
                SyncStorage.set('phone', this.state.login);
                this.props.navigation.dispatch(StackActions.replace('OrderWait'));
            }
          })
          .catch(error => {
            //   if (error.status === 401) {
                // if (data.Id === -2) {
                // console.log(error);
                Alert.alert(this.state.lang_obj.errors.minus2.name, this.state.lang_obj.errors.minus2.body, [{text: 'OK'}])
                // }
            //   }
          })
    }
    render() {
        return (
            <View style={styles.MainLogin}>
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
        )
    }
}