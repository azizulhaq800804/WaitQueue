import React, { Component } from 'react';
import { Button, View,TextInput, TouchableOpacity, Picker, platform, ScrollView, Image } from 'react-native';
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

export default class AddChamberScreen extends Component {
  
  constructor(props) {
    super(props);
    //this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
  }
 
  state ={screenName:"ADD_CHAMBER", response:"", name:"", 
          doctor_name:"", user:{}, category:1, 
          categories:[], city:1,cities:[], country:1, countries:[],
          phone_number:"", address:"", start_time: "", end_time: "", 
          start_time:"", end_time:"", holiday:"", image:null
        }

  submit(){
    
    
    let data = new FormData();
    // data.append("name", this.state.name);
    // data.append("doctor_name", this.state.doctor_name);

    Object.entries(this.state).map(([key, value])=>{
        if ( value.constructor !== ([]).constructor)
           data.append(key, value)
    })


    let url = Config.PROTOCOL + Config.HOST +":" + Config.PORT + Config.SERVICE_ADD_CHAMBER
    console.log(url)
    let {user} = this.state
    console.log(user)

    Communication.post(url, data, user.access_token, (error, response)=>{

      if(error) 
      {  this.setState({response:"Network Request Failed."})
         console.log(this.state)
      }
      else
      {
        console.log("Response Received for login")
        console.log(response)
        if(response.result == 1)
        {  
          console.log(response)
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

  componentWillMount(){

    this.setState({user:this.props.navigation.getParam("user", null)})
    // Retrive initial data at once
    let url = Config.PROTOCOL + Config.HOST +":" + Config.PORT + Config.SERVICE_CAT_CITY_COUNTRY
    console.log(url)
    let {user} = this.state
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
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };
  
   _pickImageGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };


  render() {
      
      let { image } = this.state;

      return (
        <ScrollView style={styles.scrollViewContainer}> 
          <View style={styles.column}>
            <Text h2> Add Chamber</Text>
           
            
            <Text style={styles.label}>Chamber Name
            </Text>
            <Input autoFocus
              ref={(input) => { this.email = input; }}
              placeholder='Name'
              leftIcon={{ type: 'font-awesome', name: 'hospital-o'  }}
              onChangeText={(text)=>this.handleChangeText({name:text})}
              value={this.state.name}
              name="name"
            />
            <Text style={styles.label}>Doctor Name
            </Text>
            <Input
              placeholder='Doctor Name'
              leftIcon={{ type: 'font-awesome', name: 'id-card' }}
              onChangeText={(text)=>this.handleChangeText({doctor_name:text})}
              value={this.state.doctor_name}
            />

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
              selectedValue={this.state.city}
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
            <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    


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

