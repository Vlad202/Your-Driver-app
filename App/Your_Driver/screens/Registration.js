import React, { Component } from 'react'
import * as Font from 'expo-font';
import styles from '../Styles'
import {View, Text, Button, Alert, TextInput, TouchableOpacity} from 'react-native'
import { Input } from 'react-native-elements';
import SyncStorage from 'sync-storage';
import axios from 'axios';

export class Registration extends Component {
    state = {
        phone: '',
        password: '',
        confirm_pass: '',
        confirm_code: '',
        name: '',
    }
    LoginBtn = () => {
        let phone = this.state.phone;
        if(phone.includes('+') || phone.includes('-') || phone.includes('(') || phone.includes(')')) {
            Alert.alert('Заполните поля правильно!', 'Номер телефона должен содержать только цифры, без иных символов!')
            return null;
        };
        if(this.state.phone.length != 12) {
            Alert.alert('Введите корректный номер телефона!', 'Длина номера телефона должна равняться 12 символам. Номер должен начинаться с цифры 3')
            return null;
        }
        axios.post('http://online.deluxe-taxi.kiev.ua:9050/api/account/register', 
        {
            phone: this.state.phone,
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
            if (data.status === 200) {
                console.log(data);
                SyncStorage.set('phone', this.state.phone);
                SyncStorage.set('name', this.state.name);
                this.props.navigation.dispatch(StackActions.replace('OrderWait'));
            }
          })
        //   .catch(error => {
        //       console.log(error);
        //   })
    }
    render() {
        return (
            <View style={styles.MainLogin}>
                <View>
                    <Text style={styles.Logo}>Your Driver</Text>
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
                        placeholder="Код подтверждения"
                        onChangeText={(confirm_code) => this.setState({confirm_code})}
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
                    <TextInput
                        style={styles.input}
                        placeholder="Имя"
                        onChangeText={(name) => this.setState({name})}
                        // onChange={this.onTextInputChangePhone}
                        maxLength={36}
                        secureTextEntry={true}
                    />
                    <View style={styles.btnLog}>
                    <TouchableOpacity onPress={this.LoginBtn} style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}>Войти</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.authRoutes}>
                    <Text style={styles.routesTexts} onPress={() => {this.props.navigation.navigate('SignIn')}}>Уже есть аккаунт? Войдите.</Text>
                </View>
            </View>
        )
    }
}