import React, { Component } from 'react'
import * as Font from 'expo-font';
import styles from '../Styles'
import {Animated, View, Text, Button, Alert, TextInput, TouchableOpacity} from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import SyncStorage from 'sync-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainOrder } from './MainOrder'

const Stack = createStackNavigator();
export class SendSms extends Component {
    state = {
        phone: '',
        code: '',
    }
    SmsBtn = () => {
        function setLocalData(data) {
            SyncStorage.set('token', data['token']);
            SyncStorage.set('phone', data['phone']);
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="MainOrder" component={MainOrder} options={{ headerShown: false }} />
                </Stack.Navigator>
            </NavigationContainer>
            
        }
        async function postData(url = '', formdata) {
            const response = await fetch(url, {
              method: 'POST',
              redirect: 'follow',
              body: formdata,
            });
            return await response.json();
        }
        this.state.phone = SyncStorage.get('phone')
        let formdata = new FormData();
        formdata.append("phone", this.state.phone);
        formdata.append("accept_code", this.state.code);
        console.log(this.state.code);
        postData('http://192.168.0.101:8000/api/v1/auth/accept/', formdata)
        .then((data) => {
            // if(data.code == 201) {
                console.log(data)
                setLocalData(data)
            // }
        });
    }
    render() {
        return (
            <View style={styles.MainSms}>
                <View>
                    <Text style={styles.LogoSms}>Your Driver</Text>
                </View>
                <View style={styles.SmsInp}>
                    <TextInput
                        style={styles.input}
                        placeholder="Код смс"
                        onChangeText={(code) => this.setState({code})}
                        maxLength={4}
                    />
                    <View style={styles.btnLog}>
                        <TouchableOpacity onPress={this.SmsBtn} style={styles.appButtonContainer}>
                            <Text style={styles.appButtonText}>Отправить</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                    <View style={styles.countdown}>
                        <CountdownCircleTimer
                            isPlaying
                            size={120}
                            onComplete={() => {
                                Alert.alert(
                                'Время вышло',
                                'Время ожидания подтверждения вышло. Попробуйте ещё раз.',
                                [
                                {
                                    text: 'Вернуться',
                                    onPress: () => {
                                        this.props.navigation.navigate('SignUp');
                                    },
                                    style: 'cancel'
                                }
                                ],
                                { cancelable: false }
                            )}
                            }
                            duration={60}
                            colors={[['#81c784', 0.33], ['#ffd54f', 0.33], ['#ff7043']]}>
                            {({ remainingTime, animatedColor }) => (
                            <Animated.Text style={{ color: animatedColor }}>
                                {remainingTime}
                            </Animated.Text>
                            )}
                        </CountdownCircleTimer>
                </View>
            {/* </View> */}
            </View>
        )
    }
}