import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainOrder } from './screens/MainOrder';
import { OrderWait } from './screens/OrderWait';
import { SignUp } from './screens/SignUp';
import { Registration } from './screens/Registration';
import { SignIn } from './screens/SignIn';
import { MapReview } from './screens/mapReview';
import { ResetPassword } from './screens/ResetPassword';
import { ResetPasswordConfirm } from './screens/ResetPassConfirm';
import { SetNewPass } from './screens/SetNewPass';
import { SendSms } from './screens/SendSms';
import axios from 'axios';
import * as Font from 'expo-font';
import {Alert} from 'react-native';
import SyncStorage from 'sync-storage';
import * as ru from './langs/ru.json';
import * as uk from './langs/uk.json';
import * as en from './langs/en.json';

const Stack = createStackNavigator();
export default class App extends Component {
  state = {
    auth_flag: false,
  }
  componentDidMount() {
    if (SyncStorage.get('lang') != 'ru' || SyncStorage.get('lang') != 'en' || SyncStorage.get('lang') != 'uk') {
      SyncStorage.set('lang', 'uk');
    }
    if (SyncStorage.get('lang') === 'ru') {
      this.state.lang_obj = ru;
    }
    if (SyncStorage.get('lang') === 'uk') {
      this.state.lang_obj = uk;
    }
    if (SyncStorage.get('lang') === 'en') {
      this.state.lang_obj = en;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        let lon = position['coords']['longitude'];
        let lat = position['coords']['latitude'];
      },
      error => {
        Alert.alert(this.state.lang_obj.errors.geoError.name, this.state.lang_obj.errors.geoError.body);
      },
      { maximumAge: 0 },
    );
    axios.get('http://cors-test.appspot.com/test')
    .then(data => {
      // if (data.status === 200) this.setState({auth_flag: true});
    })
    Font.loadAsync({
      SatisfyRegular: require('./assets/fonts/Satisfy-Regular.ttf'),
    });
  }
  render () {
    return (
      this.state.auth_flag ? (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="MainOrder" component={MainOrder} options={{ headerShown: false }} />
            <Stack.Screen name="MapReview" component={MapReview} options={{ headerShown: false }} />
            <Stack.Screen name="OrderWait" component={OrderWait} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPasswordConfirm" component={ResetPasswordConfirm} options={{ headerShown: false }} />
            <Stack.Screen name="SetNewPass" component={SetNewPass} options={{ headerShown: false }} />
            <Stack.Screen name="SendSms" component={SendSms} options={{ headerShown: false }} />
            <Stack.Screen name="MainOrder" component={MainOrder} options={{ headerShown: false }} />
            <Stack.Screen name="MapReview" component={MapReview} options={{ headerShown: false }} />
            <Stack.Screen name="OrderWait" component={OrderWait} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      )
    )
  }
}