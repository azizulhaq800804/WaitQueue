import React, { Component } from 'react';
import { Button, View,TextInput, TouchableOpacity, Picker, Platform, ScrollView, Image } from 'react-native';
import { Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from '../styles'
import { Config } from '../config'
import isaac from "isaac"
import {Storage} from "../components/storage"
import {Communication} from "../components/communication"
import FormData from 'form-data'
import MyDatePicker from '../components/myDatePicker'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { NavigationEvents } from 'react-navigation';
import ValidationComponent from 'react-native-form-validator';


export default class AddChamberScreen extends ValidationComponent {
  
  constructor(props) {
    super(props);
    //this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
  }
 
  state ={screenName:"ADD_CHAMBER", response:"", name:"", 
          doctor_name:"", user:null, category:1, 
          categories:[], city:1,cities:[], country:1, countries:[],
          phone_number:"", address:"", start_time: "", end_time: "", 
          start_time:"9:00", end_time:"21:00", holiday:1, image:null, user_id:-1
        }

  submit(){
    
    this.validate({
      doctor_name: { required: true},
      name: { required: true},
      phone_number: {numbers: true, required: true}
      
    });

    if( !this.isFormValid() )
      return;



    let data = new FormData();
    // data.append("name", this.state.name);
    // data.append("doctor_name", this.state.doctor_name);

    
    Object.entries(this.state).map(([key, value])=>{
        if ( value && value.constructor !== ([]).constructor 
            && value.constructor !== ({}).constructor )
        { 
          data.append(`${key}`, value)
    
        }
    })
  
    // Not sure why this is not working
    //type field in image picker is 'image'
    // data.append('image',{...this.state.image})
    if(this.state.image)
      data.append('photo',{name:"photo", type:'image/jpg', uri:this.state.image.uri})

    let url = Config.PROTOCOL + Config.HOST +":" + Config.PORT + Config.SERVICE_ADD_CHAMBER
    console.log(url)
    let {user} = this.state

    Communication.postForm(url, data, {}, user.access_token, (error, response)=>{;
      if(error) 
      { 
        this.setState({response:"Network Request Failed."})
      }
      else
      {
        console.log("Response Received for AddChamber")
        
        if(response.result == 1)
        {  
          this.props.navigation.navigate('Dashboard', {message:"Chamber Added"})
        }
        else
        {
          this.setState({response:response.message})
          
        }  
      }  
    })


  }

  _onPressButton() {
    alert('You tapped the button!')
  }

  componentDidMount(){
    //this.email.focus();
    this.getPermissionAsync();
  }

  navigationFocus(payload)
  {

  }

  componentWillMount(){

    
    let user = this.props.navigation.getParam("user", null);
    this.setState({user:user, user_id:user.userid})
   
    // Retrive initial data at once
    let url = Config.PROTOCOL + Config.HOST +":" + Config.PORT + Config.SERVICE_CAT_CITY_COUNTRY
    console.log(url)
    Communication.get(url, user.access_token, (error, response)=>{
      if (error)
        this.setState({response:"Failed to retrieve data during initialization"})
      else
      {
        this.setState({categories:response.categories, countries:response.countries, cities:response.cities})

      }  
    })  

    //this.email.focus();
  }

  changeScreen(screenName)
  {
      this.setState((state,props)=>{
         return {screenName:"Login"}

      })

  }

  /*Not working */
  handleChange(event = {}) {
    const name = event.target && event.target.name;
    const value = event.target && event.target.value;
    this.setState({[name]: value});
  }

  handleChangeText(text = {}) {
    this.setState(text);
    console.log(this.state)
  }

  onStartDateChange(time)
  {
    this.setState({start_time:time})

  }

  onEndDateChange(time)
  {
    this.setState({end_time:time})
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImageCamera = async () => {
    try{  
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });

      console.log(result);

      let filename = result.uri.split('/').pop()
      let match = /\.(.+)$/.exec(filename);
      let type = match[0]? `image/${match[1]}`:'image'

      if (!result.cancelled) {
        this.setState({ image: {name: filename, type:type, uri:Platform.OS === "android" ? result.uri : result.uri.replace("file://", "") }});
      }
    }
    catch(err){console.log(err)}
  };
  
   _pickImageGallery = async () => {
    
    try{
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });

      console.log(result);
      let filename = result.uri.split('/').pop()
      let match = /\.(.+)$/.exec(filename);
      let type = match[0]? `image/${match[1]}`:'image'

      if (!result.cancelled) {
        this.setState({ image: {name: filename, type:type, uri:Platform.OS === "android" ? result.uri : result.uri.replace("file://", "") }});
      }
    }  
    catch(err){
      console.log(err)
    }  
  
  };


  render() {
      
      let { image } = this.state;

      return (
        <ScrollView style={styles.scrollViewContainer}> 
          <NavigationEvents
                onDidFocus={(payload) => this.navigationFocus(payload)}
          /> 
          <View style={styles.column}>
            <Text h2> Add Chamber</Text>
           
            
            <Text style={styles.label}>Chamber Name
            </Text>
            <Input autoFocus
              ref={(input) => { this.email = input; }}
              placeholder='Name'
              leftIconContainerStyle = {{marginLeft:-3}}
              leftIcon={{ type: 'font-awesome', name: 'hospital-o'  }}
              onChangeText={(text)=>this.handleChangeText({name:text})}
              value={this.state.name}
              name="name"
            />
            {this.isFieldInError('name') && this.getErrorsInField('name').map(errorMessage => <Text key={errorMessage} style={styles.error}>{errorMessage}</Text>) }
           
            <Text style={styles.label}>Doctor Name
            </Text>
            <Input
              placeholder='Doctor Name'
              leftIconContainerStyle = {{marginLeft:-3}}
              leftIcon={{ type: 'font-awesome', name: 'id-card' }}
              onChangeText={(text)=>this.handleChangeText({doctor_name:text})}
              value={this.state.doctor_name}
            />

            {this.isFieldInError('doctor_name') && this.getErrorsInField('doctor_name').map(errorMessage => <Text key={errorMessage} style={styles.error}>{errorMessage}</Text>) }
           
            <Text style={styles.label}>Category</Text>
            <Picker
              selectedValue={this.state.category}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>{
                this.setState({category: itemValue})
              }
              }>
              {this.state.categories.map((item)=>
                 <Picker.Item key={item.id} label={item.name} value={item.id} />
              )}
             </Picker>

            <Text style={styles.label}>Phone Number</Text>
 
            <Input
              placeholder='Phone Number'
             leftIcon={{ type: 'font-awesome', name: 'phone' }}
              onChangeText={(text)=>this.handleChangeText({phone_number:text})}
              value={this.state.phone_number}
            />
            {this.isFieldInError('phone_number') && this.getErrorsInField('phone_number').map(errorMessage => <Text key={errorMessage} style={styles.error}>{errorMessage}</Text>) }
           

            <Text style={styles.label}>Address</Text>

            <Input
              placeholder='Address'
             leftIcon={{ type: 'font-awesome', name: 'address-card' }}
              onChangeText={(text)=>this.handleChangeText({address:text})}
              value={this.state.address}
            />

            <Text style={styles.label}>City</Text>
             <Picker
              selectedValue={this.state.city}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>{
                this.setState({city: itemValue})
              }
              }>
              {this.state.cities.map((item)=>
                 <Picker.Item key={item.id} label={item.name} value={item.id} />
              )}
             </Picker>

             <Text style={styles.label}>Country</Text>
             <Picker
              selectedValue={this.state.country}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>{
                this.setState({country: itemValue})
              }
              }>
              {this.state.countries.map((item)=>
                 <Picker.Item key={item.id} label={item.name} value={item.id} />
              )}
             </Picker>

            <View style={styles.row}> 
              <Text style={styles.label}>Start Time</Text>
              <MyDatePicker onDateChange={this.onStartDateChange}/>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>End Time</Text>
             <MyDatePicker onDateChange={this.onEndDateChange}/>
            </View> 

            <Text style={styles.label}>Holiday</Text>
             <Picker
              selectedValue={this.state.holiday}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>{
                this.setState({holiday: itemValue})
              }
              }>
              
                 <Picker.Item  label="Friday" value="Friday" />
                 <Picker.Item  label="Saturday" value="Saturday" />
                 <Picker.Item  label="Sunday" value="Sunday" />
                 <Picker.Item  label="Monday" value="Monday" />
                 <Picker.Item  label="Tuesday" value="Tuesday" />
                 <Picker.Item  label="Wednesday" value="Wednesday" />
                 <Picker.Item  label="Thursday" value="Thursday" />

             </Picker>

            <Text style={styles.label}>Pick Photo</Text>

            <View style={styles.row}>
              
              <View style={styles.buttonContainer}>
                <Button
                  title="Camera"
                  onPress={this._pickImageCamera}
                />
              </View>
              
              <View style={styles.buttonContainer}>
              <Button
                  title="Gallery"
                  onPress={this._pickImageGallery}
                />
              </View>
             </View>

            {image &&
            <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
    


             <Text style={styles.error} >{this.state.response}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}
               onPress={()=>{this.submit()}}
               >
              <Text style={styles.labelButton}> SUBMIT</Text>
              </TouchableOpacity>
            </View>

          </View>  
        </ScrollView>
      );

  }
}

