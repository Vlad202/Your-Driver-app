import React, { Component } from 'react'
import * as Font from 'expo-font';
import styles from '../Styles'
import {View, Text, Button, Alert, Image, TextInput, TouchableOpacity} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainOrder } from './MainOrder'
import SyncStorage from 'sync-storage';
import axios from 'axios';
import {Logo} from '../Logo';
import * as ru from '../langs/ru.json';
import * as uk from '../langs/uk.json';
import * as en from '../langs/en.json';
import { Dimensions } from 'react-native';

export class ResetPasswordConfirm extends Component {
    state = {
        confirm_code: '',
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
        axios.post('http://online.deluxe-taxi.kiev.ua:9050/api/account/restore/checkConfirmCode', 
        {
            phone: SyncStorage.get('phone_confirm'),
            confirm_code: this.state.confirm_code,
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
        .then((data) => {
            console.log(data)
            if (data.status === 200) {
                SyncStorage.set('confirm_code', this.state.confirm_code)
                this.props.navigation.navigate('SetNewPass')
            }
        })
        .catch(error => {
            if (error.response.data.Id === -35) {
                Alert.alert(this.state.lang_obj.errors.minus35.name, this.state.lang_obj.errors.minus35.body,[{text: 'OK'}])
            }
            if (error.response.data.Id === -34) {
                Alert.alert(this.state.lang_obj.errors.minus34.name, this.state.lang_obj.errors.minus34.body,[
                    {
                        text: 'OK', onPress: () => this.props.navigation.navigate('SignIn')
                    }
                ])
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
                        placeholder={this.state.lang_obj.confirmCode}
                        onChangeText={(confirm_code) => this.setState({confirm_code})}
                        // onChange={this.onTextInputChangePhone}
                        maxLength={12}
                    />
                    <View style={styles.btnLog}>
                        <TouchableOpacity onPress={this.LoginBtn} style={styles.appButtonContainer}>
                            <Text style={styles.appButtonText}>{this.state.lang_obj.btnSend}</Text>
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