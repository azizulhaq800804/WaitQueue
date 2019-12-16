import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, Platform, Image, ScrollView } from "react-native";
import { List, ListItem, SearchBar, Card, Button, Icon } from "react-native-elements";
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import {Config} from "../config"
import {styles} from '../styles'
import Category from "react-native-category";
import {Communication} from "../components/communication"
import { NavigationEvents } from 'react-navigation';

class ChamberDetailScreen extends Component {
  constructor(props)
  {
    super(props)   
    this.state ={chamber:null}
  }    
   

  navigationFocus = () =>{
    let chamber = this.props.navigation.getParam("chamber", null)
    chamber && this.setState({chamber})
  }

  render()
  {
    let {chamber} = this.state
    return (
      <ScrollView style={styles.scrollViewContainer}>
        <NavigationEvents
            onDidFocus={(payload) => this.navigationFocus(payload)}
        /> 
     
        { chamber && 
            <View>
                <View style={{...styles.column, justifyContent:'center', alignItems: 'center'}}>
                
                    <Image style={{ width: 200, height: 200 }} source={{ uri:`${Config.PROTOCOL}${Config.HOST}:${Config.PORT}${Config.IMAGE_PATH}${chamber.picture}`}}/>
                </View>
                <View style={{...styles.column, marginTop:20}}>
                    
                    <Text style={styles.label}>
                        Chamber Name: {chamber.chamber_name}
                    </Text>
                    <Button
                    icon={<Icon name='code' color='#ffffff' />}
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                    title='Appointpent' />
                </View>
            </View>
         }    
       </ScrollView>
    )
  }
} 
export default ChamberDetailScreen;