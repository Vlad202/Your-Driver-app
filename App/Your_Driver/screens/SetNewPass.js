import React, { Component } from 'react'
import * as Font from 'expo-font';
import styles from '../Styles'
import {View, Text, Image, Alert, TextInput, TouchableOpacity} from 'react-native'
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
import {StackActions} from '@react-navigation/native'; 
import { Dimensions } from 'react-native';

export class SetNewPass extends Component {
    state = {
        confirm_code: '',
        lang_obj: {},
        password: '',
        confirm_pass: ''
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
    //  error.response.data.Id
    LoginBtn = () => {
        if (this.state.password === '' || this.state.confirm_pass === '') {
            Alert.alert(this.state.lang_obj.errors.passwordisEmpty.name, this.state.lang_obj.errors.passwordisEmpty.body)
            return null
        }
        if (this.state.password !== this.state.confirm_pass) {
            Alert.alert(this.state.lang_obj.errors.passwordConfirmError1.name, this.state.lang_obj.errors.passwordConfirmError1.body)
            return null
        }
        axios.post('http://online.deluxe-taxi.kiev.ua:9050/api/account/restore', 
        {
            phone: SyncStorage.get('phone_confirm'),
            confirm_code: SyncStorage.get('confirm_code'),
            password: this.state.password,
            confirm_password: this.state.confirm_pass,
        },
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': '', 
                'Authorization': 'Basic YWNod...YQ==',
                'X-WO-API-APP-ID': '10999'
            }
        })
        .then((data) => {
            console.log(data);
            if (data.status === 201) {
                this.props.navigation.dispatch(StackActions.replace('MainOrder'));
            }
        })
        .catch (error => {
            if (error.response.data.Id === -3) {
                Alert.alert(this.state.lang_obj.errors.minus3.name, this.state.lang_obj.errors.minus3.body,[{text: 'OK'}])
            }
            if (error.response.data.Id === -4) {
                Alert.alert(this.state.lang_obj.errors.minus4.name, this.state.lang_obj.errors.minus4.body,[{text: 'OK'}])
            }
            if (error.response.data.Id === -5) {
                Alert.alert(this.state.lang_obj.errors.minus5.name, this.state.lang_obj.errors.minus5.body,[{text: 'OK'}])
            }
            if (error.response.data.Id === -31) {
                Alert.alert(this.state.lang_obj.errors.minus31.name, this.state.lang_obj.errors.minus31.body,[{text: 'OK'}])
            }
            if (error.response.data.Id === -35) {
                Alert.alert(this.state.lang_obj.errors.minus35.name, this.state.lang_obj.errors.minus35.body,[{text: 'OK'}])
            }
            if (error.response.data.Id === -34) {
                Alert.alert(this.state.lang_obj.errors.minus34.name, this.state.lang_obj.errors.minus35.body,[
                    {
                        text: 'OK', onPress: () => this.props.navigation.navigate('SignIn')
                    }
                ])
            }
            if (error.response.data.Id === -36) {
                Alert.alert(this.state.lang_obj.errors.minus36.name, this.state.lang_obj.errors.minus36.body,[{text: 'OK'}])
            }
            if (error.response.data.Id === -37) {
                Alert.alert(this.state.lang_obj.errors.minus37.name, this.state.lang_obj.errors.minus37.body,[{text: 'OK'}])
            }
            if (error.response.data.Id === -38) {
                Alert.alert(this.state.lang_obj.errors.minus38.name, this.state.lang_obj.errors.minus38.body,[{text: 'OK'}])
            }
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
                        placeholder="Пароль"
                        onChangeText={(password) => this.setState({password})}
                        // onChange={this.onTextInputChangePhone}
                        maxLength={36}
                        secureTextEntry={true}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Подтвердите пароль"
                        onChangeText={(confirm_pass) => this.setState({confirm_pass})}
                        // onChange={this.onTextInputChangePhone}
                        maxLength={36}
                        secureTextEntry={true}
                    />
                    <View style={styles.btnLog}>
                        <TouchableOpacity onPress={this.LoginBtn} style={styles.appButtonContainer}>
                            <Text style={styles.appButtonText}>{this.state.lang_obj.signin}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.authRoutes}>
                    <Text style={styles.routesTexts} onPress={() => {this.props.navigation.navigate('SignUp')}}>{this.state.lang_obj.register}</Text>
                    <Text style={styles.routesTexts} onPress={() => {this.props.navigation.navigate('SignIn')}}>{this.state.lang_obj.signin}</Text>
                </View>
            </View>
        </View>
        </ScrollView>
        )
    }
}