import React, { Component } from 'react';
import { Button, View,TextInput, TouchableOpacity } from 'react-native';
import { Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from '../styles'
import { Config } from '../config'
import isaac from "isaac"
import {Storage} from "../components/storage"
import {Communication} from "../components/communication"



export default class LoginScreen extends Component {
  
  constructor(props) {
    super(props);
    //this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);

  }

  state ={screenName:"LOGIN", response:"", email:"", password:""}

  submit(){
    
    
    let data ={
        email: this.state.email,
        password: this.state.password
    }

    let url = Config.PROTOCOL + Config.HOST +":" + Config.PORT + Config.SERVICE_LOGIN
    console.log(url)
 
    Communication.post(url, data,"", (error, response)=>{

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
          let user = {userid:response.userid, username:response.username, access_token:response.token}
          Storage.storeData("user", user, (error)=>
          {
            if(error){
              console.log(error)
              this.setState({response:"Error Storing user data"})
            }
            else  
            {  // Navigate to dahsboard
              this.props.navigation.navigate('Dashboard')
            }
          })  
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
    console.log(this.state)
  }

  handleChangeText(text = {}) {
    this.setState(text);
    console.log(this.state)
  }



  render() {
   

      return (
        <View style={styles.container}> 
          <View style={styles.column}>
            <Text h2> Login</Text>
           
            
            <Text style={styles.label}>Email
            </Text>
            <Input autoFocus
              ref={(input) => { this.email = input; }}
              placeholder='Email'
              leftIcon={{ type: 'font-awesome', name: 'envelope-square' }}
              onChangeText={(text)=>this.handleChangeText({email:text})}
              value={this.state.email}
              name="email"
            />
            <Text style={styles.label}>Password
            </Text>
            <Input
              placeholder='Password'
              secureTextEntry={true}
              leftIcon={{ type: 'font-awesome', name: 'lock' }}
              name="password"
              onChangeText={(text)=>this.handleChangeText({password:text})}
              value={this.state.password}
            />
             <Text style={styles.error} >{this.state.response}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}
               onPress={()=>{this.submit()}}
               >
              <Text style={styles.labelButton}> SUBMIT</Text>
              </TouchableOpacity>
            </View>

             <View style={styles.buttonContainer}>
               <Button style={styles.button}
                 onPress={()=>{this.props.navigation.navigate('SignUP')}}
                 title="Sign UP"
                 color="#841584"
               />
             </View>
          </View>  
        </View>
      );

  }
}

