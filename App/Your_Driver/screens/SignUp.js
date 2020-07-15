import React, { Component } from 'react'
import * as Font from 'expo-font';
import styles from '../Styles'
import {View, Text, Button, Alert, TextInput, TouchableOpacity} from 'react-native'
import { Input } from 'react-native-elements';
import SyncStorage from 'sync-storage';
import axios from 'axios';
import {Logo} from '../Logo';
import * as ru from '../langs/ru.json';
import * as uk from '../langs/uk.json';
import * as en from '../langs/en.json';
import Flag from 'react-native-flags';

export class SignUp extends Component {
    state = {
        name: '',
        phone: '',
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
    LoginBtn = () => {
        let phone = this.state.phone;
        // if(phone.includes('+') || phone.includes('-') || phone.includes('(') || phone.includes(')')) {
        //     Alert.alert('Заполните поля правильно!', 'Номер телефона должен содержать только цифры, без иных символов!')
        //     return null;
        // };
        // if(this.state.phone.length != 12) {
        //     Alert.alert('Введите корректный номер телефона!', 'Длина номера телефона должна равняться 12 символам. Номер должен начинаться с цифры 3')
        //     return null;
        // }
        axios.post('http://online.deluxe-taxi.kiev.ua:9050/api/account/register/sendConfirmCode', 
        {
            phone: this.state.phone,
        },
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': '', 
                'Authorization': 'Basic YWNod...YQ==',
                'X-WO-API-APP-ID': '10999',
            },
        })
        .then((data) => {
            if(data.status === 200) {
                console.log(data);
                SyncStorage.set('phone', this.state.phone)
                this.props.navigation.navigate('Registration');
                return
            }
            console.log(data);
            // if (data.Id === -32) {
            //     Alert.alert(this.state.lang_obj.errors.minus32.name, 
            //         this.state.lang_obj.errors.minus32.body,
            //         [
            //             {
            //                 text: 'OK', onPress: () => this.props.navigation.navigate('SignIn')
            //             }
            //         ]    
            //     )
            // }
            // if (data.Id === -34) {
            //     Alert.alert(this.state.lang_obj.errors.minus34.name, this.state.lang_obj.errors.minus34.body, [{text: 'OK'}])
            // }
            // if (data.Id === -31) {
            //     Alert.alert(this.state.lang_obj.errors.minus31.name, this.state.lang_obj.errors.minus31.body,[{text: 'OK'}])
            // }
            // if (data.Id === -33) {
            //     Alert.alert(this.state.lang_obj.errors.minus33.name, this.state.lang_obj.errors.minus33.body,[{text: 'OK'}])
            // }
        })
        .catch(error => {
            console.log(error);
            // if (error.Id === -34) {
                // Alert.alert(this.state.lang_obj.errors.minus34.name, this.state.lang_obj.errors.minus34.body, [{text: 'OK'}])
            // }
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
                        onChange={this.onTextInputChangePhone}
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
        )
    }
}