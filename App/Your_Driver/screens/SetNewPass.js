import React, { Component } from 'react'
import * as Font from 'expo-font';
import styles from '../Styles'
import {View, Text, Button, Alert, TextInput, TouchableOpacity} from 'react-native'
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

export class SetNewPass extends Component {
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
        axios.post('http://online.deluxe-taxi.kiev.ua:9050/api/account/restore', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': '', 
                'Authorization': 'Basic YWNod...YQ==',
                'X-WO-API-APP-ID': 'Driver-Киев'
            },
            formData: {
                phone: SyncStorage.get('phone'),
                confirm_code: this.state.confirm_code,
                password: this.state.password,
                confirm_password: this.state.confirm_password,
            }
        })
        .then((data) => {
            console.log(data);
            if (data.status === 201) {
                this.props.navigation.dispatch(StackActions.replace('OrderWait'));
            }
            if (data.Id === -3) {
                Alert.alert(this.state.lang_obj.errors.minus3.name, this.state.lang_obj.errors.minus3.body,[{text: 'OK'}])
            }
            if (data.Id === -4) {
                Alert.alert(this.state.lang_obj.errors.minus4.name, this.state.lang_obj.errors.minus4.body,[{text: 'OK'}])
            }
            if (data.Id === -5) {
                Alert.alert(this.state.lang_obj.errors.minus5.name, this.state.lang_obj.errors.minus5.body,[{text: 'OK'}])
            }
            if (data.Id === -31) {
                Alert.alert(this.state.lang_obj.errors.minus31.name, this.state.lang_obj.errors.minus31.body,[{text: 'OK'}])
            }
            if (data.Id === -35) {
                Alert.alert(this.state.lang_obj.errors.minus35.name, this.state.lang_obj.errors.minus35.body,[{text: 'OK'}])
            }
            if (data.Id === -34) {
                Alert.alert(this.state.lang_obj.errors.minus34.name, this.state.lang_obj.errors.minus35.body,[
                    {
                        text: 'OK', onPress: () => this.props.navigation.navigate('SignIn')
                    }
                ])
            }
            if (data.Id === -36) {
                Alert.alert(this.state.lang_obj.errors.minus36.name, this.state.lang_obj.errors.minus36.body,[{text: 'OK'}])
            }
            if (data.Id === -37) {
                Alert.alert(this.state.lang_obj.errors.minus37.name, this.state.lang_obj.errors.minus37.body,[{text: 'OK'}])
            }
            if (data.Id === -38) {
                Alert.alert(this.state.lang_obj.errors.minus38.name, this.state.lang_obj.errors.minus38.body,[{text: 'OK'}])
            }
        });
    }
    render() {
        return (
            <View style={styles.MainLogin}>
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
                <View style={styles.inputsView}>
                    <TextInput
                        style={styles.input}
                        placeholder="Телефон"
                        onChangeText={(phone) => this.setState({phone})}
                        // onChange={this.onTextInputChangePhone}
                        maxLength={12}
                    />
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
        )
    }
}