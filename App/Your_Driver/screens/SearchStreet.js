import React, { Component } from 'react'
import * as Font from 'expo-font';
import styles from '../Styles'
import {View, Text, Image, Alert, TextInput, TouchableOpacity, ScrollView} from 'react-native'
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

export class SearchStreet extends Component {
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
        });
        this.state.url = 'http://online.deluxe-taxi.kiev.ua:'+SyncStorage.get('port')+'/api/geodata/streets/search?q=1&limit=30'
        axios.get(this.state.url)
        .then(data => {
            this.setState({data: data.data});    
        })
     }
     Redirect = (item) => {
        this.props.navigation.navigate('secondAdress', {name: item.name});
     }
    _streetsParse = () => {
        if (!this.state.data) {
            return (
                <View>
                    {/* <Text style={styles.helloText}>Loading...</Text> */}
                </View>
            )
        } else {
            let msg = this.state.message;
            this.state.url = 'http://online.deluxe-taxi.kiev.ua:'+SyncStorage.get('port')+'/api/geodata/streets/search?q='+ msg +'&limit=30'
            axios.get(this.state.url)
            .then(data => {
                if (msg === this.state.message) {
                    if (data.data.geo_streets.geo_street[0].name !== this.state.items[0] && data.data.geo_streets.geo_street[data.data.geo_streets.geo_street.length - 1].name !== this.state.items[this.state.items.length - 1]) {
                        this.setState({data: data.data});  
                    }
                } 
            })
            this.state.data.geo_streets.geo_street.map((item, key) => (
                this.state.items.push(item.name)
            ))
            return (
                this.state.data.geo_streets.geo_street.map((item, key) => (
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
                    <View onPress={() => this.setState({lang_obj: ru})} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
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
            <View style={{marginTop: '8%'}}>
                    <View style={styles.TextAreaView}>
                        {/* <View>
                            <Text style={styles.MessageTitle}>{this.state.lang_obj.messageOrderText}</Text>
                        </View> */}
                        <View style={{marginTop: '5%'}}>
                            <DelayInput
                                minLength={0}
                                onChangeText={(msg) => this.setState({message: msg})}
                                delayTimeout={200}
                                style={styles.textArea}
                                placeholder={this.state.lang_obj.street}
                            />
                    </View>
                </View>
            </View>
            <ScrollView style={{width: '100%'}}>
                {
                    this._streetsParse()
                }
            </ScrollView>
        </View>
        )
    }
}