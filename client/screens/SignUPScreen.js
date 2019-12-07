import React, { Component } from 'react';
import { Button, View,TextInput, TouchableOpacity } from 'react-native';
import { Input, Text, ButtonGroup } from 'react-native-elements';
import ValidationComponent from 'react-native-form-validator';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from '../styles'
import { Config } from '../config'
import isaac from "isaac"
import {Storage} from "../components/storage"
import {Communication} from "../components/communication"

export default class SignUPScreen extends ValidationComponent {
  
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this)
    this.updateSexIndex = this.updateSexIndex.bind(this)
    this.handleChangeText = this.handleChangeText.bind(this)
  }

  state ={screenName:"SIGNUP", errormessage:"", name:"", email:"",phoneNumber:"", password:"", sex:0 }

  submit(){
    
    // validation
    this.validate({
      name: {minlength:3, maxlength:7, required: true},
      password: {minlength:6, maxlength:10, required: true},
      email: {email: true, required: true},
      phoneNumber: {numbers: true, required: true},
      
    });

    if( !this.isFormValid() )
      return;
    // let formdata = new FormData();
    let data ={
        name: this.state.name,
        email: this.state.email,
        phoneNumber: this.state.phoneNumber,
        password: this.state.password,
        sex:this.state.sex
    }

    let url = Config.PROTOCOL + Config.HOST +":" + Config.PORT + Config.SERVICE_SIGNUP
    console.log(url)

    Communication.post(url, data, "", (error, response)=>{

      if(error) 
      {  this.setState({errormessagee:"Network Request Failed."})
         console.log(this.state)
      }
      else
      {
        console.log("Response Received for Signup")
        console.log(response)
        if(response.result == 1)
        {  
          let user = {userid:response.userid, username:response.username, access_token:response.token}
          Storage.storeData("user", user, (error)=>
          {
            if(error)
              this.setState({errormessage:"Error Storing user data"})
            else  
            {  // Navigate to dahsboard
              console.log("Navigating to Dashboard");
              this.props.navigation.navigate('Dashboard')
            }
          })  
        }
        else
        {
          this.setState({errormessage:response.message})
          
        }  

      }  


    })

  }

  _onPressButton() {
    alert('You tapped the button!')
  }

  componentDidMount(){
    //this.email.focus();
  }


  changeScreen(screenName)
  {
      this.setState((state,props)=>{
         return {screenName:"Login"}

      })

  }

  handleChangeText(text = {}) {
    this.setState(text);
    console.log(this.state)
  }

  updateSexIndex (selectedIndex) {
    this.setState({sex:selectedIndex})
  }

  render() {

       const sex = ['Male', 'Female']
       const selectedSex = this.state.sex
       
       return (
        <View style={styles.container}> 
          <View style={styles.column}>
            <Text h2> Sign Up</Text>
            <Text style={styles.error}>{this.state.errormessage}</Text>
            
            <Input
              ref={(input) => { this.name = input; }}
              autoFocus
              placeholder='Name'
              onChangeText={(text)=>this.handleChangeText({name:text})}
              leftIcon={{ type: 'font-awesome', name: 'id-card' }}
              value={this.state.name}
              name="name"
            />
            {this.isFieldInError('name') && this.getErrorsInField('name').map(errorMessage => <Text key={errorMessage} style={styles.error}>{errorMessage}</Text>) }
            <Input
              ref={(input) => { this.email = input; }}
              placeholder='Email'
              leftIcon={{ type: 'font-awesome', name: 'envelope-square' }}
              onChangeText={(text)=>this.handleChangeText({email:text})}
              value={this.state.email}
              name="email"
            />
            {this.isFieldInError('email') && this.getErrorsInField('email').map(errorMessage => <Text key={errorMessage} style={styles.error}>{errorMessage}</Text>) }

            <Input
              placeholder='Phone Number'
              leftIcon={{ type: 'font-awesome', name: 'phone' }}
              onChangeText={(text)=>this.handleChangeText({phoneNumber:text})}
              value={this.state.phoneNumber}

            />
             {this.isFieldInError('phoneNumber') && this.getErrorsInField('phoneNumber').map(errorMessage => <Text key={errorMessage} style={styles.error}>{errorMessage}</Text>) }

            <Input
              placeholder='Password'
              secureTextEntry={true}
              leftIcon={{ type: 'font-awesome', name: 'lock' }}
              onChangeText={(text)=>this.handleChangeText({password:text})}
              value={this.state.password}
              name="password"
            />
             {this.isFieldInError('password') && this.getErrorsInField('password').map(errorMessage => <Text key={errorMessage} style={styles.error}>{errorMessage}</Text>) }

            <ButtonGroup
              onPress={this.updateSexIndex}
              selectedIndex={selectedSex}
              buttons={sex}
              containerStyle={{height: 30}}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}
               onPress={()=>{this.submit()}}
               >
              <Text style={styles.labelButton}> OK</Text>
              </TouchableOpacity>
            </View>  
   
          </View>  
        </View>
      );
  }
}

