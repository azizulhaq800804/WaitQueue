import React, { Component } from 'react';
import { Button, View,TextInput, TouchableOpacity } from 'react-native';
import { Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from '../styles'
import { Config } from '../config'
import isaac from "isaac"
import {Storage} from "../components/storage"
import {Communication} from "../components/communication"
import FormData from 'form-data'


export default class AddChamberScreen extends Component {
  
  constructor(props) {
    super(props);
    //this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);

  }

  state ={screenName:"ADD_CHAMBER", response:"", name:"", doctor_name:"", user:{}}

  submit(){
    
    
    let data = new FormData();
    data.append("name", this.state.name);
    data.append("doctor_name", this.state.doctor_name);

    let url = Config.PROTOCOL + Config.HOST +":" + Config.PORT + Config.SERVICE_ADD_CHAMBER
    console.log(url)
    let {user} = this.state
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
  }

  componentWillMount(){
    this.setState({user:this.props.navigation.getParam("user", null)})
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
            <Text h2> Add Chamber</Text>
           
            
            <Text style={styles.label}>Chamber Name
            </Text>
            <Input autoFocus
              ref={(input) => { this.email = input; }}
              placeholder='Name'
              leftIcon={{ type: 'font-awesome', name: 'id-card' }}
              onChangeText={(text)=>this.handleChangeText({name:text})}
              value={this.state.name}
              name="name"
            />
            <Text style={styles.label}>Doctor Name
            </Text>
            <Input
              placeholder='Doctor Name'
              secureTextEntry={true}
              leftIcon={{ type: 'font-awesome', name: 'lock' }}
              name="password"
              onChangeText={(text)=>this.handleChangeText({doctor_name:text})}
              value={this.state.doctor_name}
            />
             <Text style={styles.error} >{this.state.response}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}
               onPress={()=>{this.submit()}}
               >
              <Text style={styles.labelButton}> SUBMIT</Text>
              </TouchableOpacity>
            </View>

          </View>  
        </View>
      );

  }
}

