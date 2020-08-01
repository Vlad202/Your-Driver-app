import React, { Component } from 'react'
import * as Font from 'expo-font';
import styles from '../Styles'
import {View, Text, KeyboardAvoidingView, Alert, Image, TextInput, ScrollView, TouchableOpacity} from 'react-native'
import { Input } from 'react-native-elements';
import SyncStorage from 'sync-storage';
import axios from 'axios';
import * as ru from '../langs/ru.json';
import * as uk from '../langs/uk.json';
import * as en from '../langs/en.json';
import {Logo} from '../Logo';
import Flag from 'react-native-flags';
import {StackActions} from '@react-navigation/native'; 
import { Dimensions } from 'react-native';

export class Registration extends Component {
    state = {
        phone: '',
        password: '',
        confirm_pass: '',
        confirm_code: '',
        name: '',
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
    LoginBtn = () => {
        // let phone = this.state.phone;
        // if(phone.includes('+') || phone.includes('-') || phone.includes('(') || phone.includes(')')) {
        //     Alert.alert('Заполните поля правильно!', 'Номер телефона должен содержать только цифры, без иных символов!')
        //     return null;
        // };
        // if(this.state.phone.length != 12) {
        //     Alert.alert('Введите корректный номер телефона!', 'Длина номера телефона должна равняться 12 символам. Номер должен начинаться с цифры 3')
        //     return null;
        // }
        axios.post('http://online.deluxe-taxi.kiev.ua:9050/api/account/register', 
        {
            phone: SyncStorage.get('phone'),
            confirm_code: this.state.confirm_code,
            password: this.state.password,
            confirm_password: this.state.confirm_pass,
            user_first_name: this.state.name,
        },
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': '', 
                'Authorization': 'Basic YWNod...YQ==',
                'X-WO-API-APP-ID': '10999'
            },
          })
          .then(data => {
              console.log(data);
            if (data.status === 201) {
                console.log(data);
                SyncStorage.set('phone', this.state.phone);
                SyncStorage.set('name', this.state.name);
                this.props.navigation.dispatch(StackActions.replace('MainOrder'));
            }
          })
          .catch(error => {
            if (error.response.data.Id === -34) {
                Alert.alert(this.state.lang_obj.errors.minus34.name, this.state.lang_obj.errors.minus34.body, [{text: 'OK'}])
            }
            if (error.response.data.Id === -31) {
                Alert.alert(this.state.lang_obj.errors.minus31.name, this.state.lang_obj.errors.minus31.body,[{text: 'OK'}])
            }
            if (error.response.data.Id === -33) {
                Alert.alert(this.state.lang_obj.errors.minus33.name, this.state.lang_obj.errors.minus33.body,[{text: 'OK'}])
            }
            if (error.response.data.Id === -34) {
                Alert.alert(this.state.lang_obj.errors.minus34.name, this.state.lang_obj.errors.minus34.body, [{text: 'OK'}])
            }
          })
    }
    render() {
        const windowWidth = Dimensions.get('window').width;
        const windowHeight = Math.round(Dimensions.get('window').height);
        return (
            <ScrollView style={{height: windowHeight, backgroundColor: '#000'}}>
            <KeyboardAvoidingView style={{flex: 1}}>
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
                        placeholder={this.state.lang_obj.confirmCode}
                        onChangeText={(confirm_code) => this.setState({confirm_code})}
                        // onChange={this.onTextInputChangePhone}
                        maxLength={12}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={this.state.lang_obj.password}
                        onChangeText={(password) => this.setState({password})}
                        // onChange={this.onTextInputChangePhone}
                        maxLength={36}
                        secureTextEntry={true}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={this.state.lang_obj.confirmPass}
                        onChangeText={(confirm_pass) => this.setState({confirm_pass})}
                        // onChange={this.onTextInputChangePhone}
                        maxLength={36}
                        secureTextEntry={true}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={this.state.lang_obj.name}
                        onChangeText={(name) => this.setState({name})}
                        // onChange={this.onTextInputChangePhone}
                        maxLength={36}
                    />
                    <View style={styles.btnLog}>
                    <TouchableOpacity onPress={this.LoginBtn} style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}>{this.state.lang_obj.btnSend}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.authRoutes}>
                    <Text style={styles.routesTexts} onPress={() => {this.props.navigation.navigate('SignIn')}}>{this.state.lang_obj.alreadyHaveAcc}</Text>
                </View>
            </View>
            </View>
            </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}