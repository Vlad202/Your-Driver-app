import React, { Component } from 'react';
import {View, StatusBar, ActivityIndicator} from 'react-native'
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
import { SearchCity } from './screens/SearchCity';
import { Cities } from './screens/Cities';
import { SearchStreet } from './screens/SearchStreet';
import { SearchHouse } from './screens/SearchHouse';
import { secondAdress } from './screens/secondAdress';
import axios from 'axios';
import * as Font from 'expo-font';
import {Alert} from 'react-native';
import SyncStorage from 'sync-storage';
import * as ru from './langs/ru.json';
import * as uk from './langs/uk.json';
import * as en from './langs/en.json';
import * as cities from './cities.json';

const Stack = createStackNavigator();
export default class App extends Component {
  state = {
    auth_flag: false,
  }
  async componentDidMount() {
    const data = await SyncStorage.init();
    console.log('AsyncStorage is ready!', data);
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
    console.log(SyncStorage.get('port'))
    if (await SyncStorage.get('phone') !== undefined) this.setState({auth_flag: true});
    console.log(await SyncStorage.get('phone'))
    console.log(await SyncStorage.get('port'))
    await Font.loadAsync({
      SatisfyRegular: require('./assets/fonts/Satisfy-Regular.ttf'),
    });
    this.setState({ assetsLoaded: true });
  }
  render () {
    const {assetsLoaded} = this.state;
    if (!assetsLoaded) {
      return (
        <View style={{
          flex: 1,
          backgroundColor: '#000',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      )
    } else {
      if (SyncStorage.get('uid') !== undefined && SyncStorage.get('phone') !== undefined) {
        return (
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="OrderWait" component={OrderWait} options={{ headerShown: false }} />
              <Stack.Screen name="MainOrder" component={MainOrder} options={{ headerShown: false }} />
              <Stack.Screen name="MapReview" component={MapReview} options={{ headerShown: false }} />
              <Stack.Screen name="SearchCity" component={SearchCity} options={{ headerShown: false }} />
              <Stack.Screen name="SearchStreet" component={SearchStreet} options={{ headerShown: false }} />
              <Stack.Screen name="SearchHouse" component={SearchHouse} options={{ headerShown: false }} />
              <Stack.Screen name="secondAdress" component={secondAdress} options={{ headerShown: false }} />
              <Stack.Screen name="Cities" component={Cities} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        )
      }
      return (
        this.state.auth_flag ? (
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="MainOrder" component={MainOrder} options={{ headerShown: false }} />
              <Stack.Screen name="MapReview" component={MapReview} options={{ headerShown: false }} />
              <Stack.Screen name="OrderWait" component={OrderWait} options={{ headerShown: false }} />
              <Stack.Screen name="SearchCity" component={SearchCity} options={{ headerShown: false }} />
              <Stack.Screen name="SearchStreet" component={SearchStreet} options={{ headerShown: false }} />
              <Stack.Screen name="SearchHouse" component={SearchHouse} options={{ headerShown: false }} />
              <Stack.Screen name="secondAdress" component={secondAdress} options={{ headerShown: false }} />
              <Stack.Screen name="Cities" component={Cities} options={{ headerShown: false }} />
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
              <Stack.Screen name="SearchCity" component={SearchCity} options={{ headerShown: false }} />
              <Stack.Screen name="SearchStreet" component={SearchStreet} options={{ headerShown: false }} />
              <Stack.Screen name="SearchHouse" component={SearchHouse} options={{ headerShown: false }} />
              <Stack.Screen name="secondAdress" component={secondAdress} options={{ headerShown: false }} />
              <Stack.Screen name="Cities" component={Cities} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        )
      )
    }
  }
}