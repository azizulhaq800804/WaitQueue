import React, { Component } from "react";
import { Button, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView from "react-native-maps"
import {styles} from "../styles"
import { NavigationEvents } from 'react-navigation';

export default class SelectLocationScreen extends Component
{
  constructor(props)
  {
    super(props)
    this.state = {
        region:{latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
               }
    }
  }

  onRegionChange = (region) => {
    //this.setState({ region });
  }

  onRegionChangeComplete = (region) => {
    //this.setState({ region });
  }

  ok = ()=>{
    this.props.navigation.navigate("AddChamber", {region:this.state.region})  


  }
  
  cancel =() =>{
    this.props.navigation.navigate("AddChamber")  
  }
  
  onPress = (event) =>{
    console.log(event.nativeEvent.coordinate)
    this.setState({ region:{...this.state.region, ...event.nativeEvent.coordinate }});
  }


  navigationFocus = (payload) =>
  {
      let location = this.props.navigation.getParam('location', null) 
      console.log(location)
      if(location)
      {  this.setState({
            region:{...this.state.region,latitude:location.coords.latitude, longitude:location.coords.longitude}
          }
        ) 
        console.log(this.state.region)    
      }
  }


  render()    
  {  
    return(
      <View style={styles.container}>
        <NavigationEvents
                onDidFocus={(payload) => this.navigationFocus(payload)}
          /> 
        <MapView style={styles.mapStyle} 
          region={this.state.region}
          initialRegion={this.state.region}
          // onRegionChange={this.onRegionChange}
          onRegionChangeComplete={this.onRegionChangeComplete}
          onPress={this.onPress}
          showsUserLocation={true}
          showsCompass={true}
          rotateEnabled={true}
        >
          <MapView.Marker
            coordinate={this.state.region}
         />
        </MapView>

       
        <View style={styles.row}>
              
              <View style={styles.buttonContainer}>
                <Button
                  title="OK"
                  onPress={this.ok}
                />
              </View>
              
              <View style={styles.buttonContainer}>
              <Button
                  title="Cancel"
                  onPress={this.cancel}
                />
              </View>
             </View>
      </View> 
    )
  }  
}


