import React, { Component } from 'react'
import * as Font from 'expo-font';
import styles from '../Styles'
import {View, Text, Button, Alert, TextInput, TouchableOpacity, ScrollView} from 'react-native'
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
import DelayInput from "react-native-debounce-input";
import * as cities from '../cities.json';

export class SearchCity extends Component {
    state = {
        confirm_code: '',
        lang_obj: {},
        message: '',
        items: [],
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
            for (let key in cities) {
                if(cities[key].name !== undefined) {
                    this.state.items.push(cities[key])
                }
            }
        });
     }
     Redirect = (item) => {
        this.props.navigation.navigate('secondAdress', {city: item.name, port: item.port});
     }
    _citiesParse = () => {
        if (!cities) {
            return (
                <View>
                    <Text style={styles.helloText}>Loading...</Text>
                </View>
            )
        } else {
            this.state.filter = this.state.items.filter(city => city.name.includes(this.state.message));
            return (
                this.state.filter.map((item, key) => (
                    <TouchableOpacity onPress={() => this.Redirect(item)} style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#222', width: '100%', paddingLeft: '18%', marginTop: 2, paddingTop: 20, paddingBottom: 20, justifyContent: 'center'}} key={key}>
                        <Text style={{color: 'white', fontFamily: 'serif'}}>{item.name}</Text>
                    </TouchableOpacity>
                ))
            )  
        }
     }
    render() {
        return (
            <View style={styles.MainSearch}>
                <View style={{marginTop: '10%'}}>
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
            <View style={{marginTop: '8%'}}>
                    <View style={styles.TextAreaView}>
                        <View>
                            <Text style={styles.MessageTitle}>{this.state.lang_obj.messageOrderText}</Text>
                        </View>
                        <View style={{marginTop: '5%'}}>
                            <DelayInput
                                minLength={0}
                                onChangeText={(msg) => this.setState({message: msg})}
                                delayTimeout={0}
                                style={styles.textArea}
                                placeholder={this.state.lang_obj.messageOrderPlaceholder}
                            />
                    </View>
                </View>
            </View>
            <ScrollView style={{width: '100%'}}>
                {
                    this._citiesParse()
                }
            </ScrollView>
        </View>
        )
    }
}