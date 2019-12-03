import React, { Component } from 'react';
import { Button, View,TextInput } from 'react-native';
import { Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from '../styles'
export default class CreateRoom extends Component {
  
  constructor(props) {
    super(props);
    this.handleChange= this.handleChange.bind(this);
  }

  state ={screenName:"CREATEROOM", response:"", name:"", email:""};

  submit(){
    
    let data = new FormData();
    data.append("roomName", this.state.roomName);
    data.append("email", this.state.email);

    fetch('https://mywebsite.com/endpoint/', {
      method: 'POST',
      headers: {
      Accept: 'application/json',
              'Content-Type': 'application/json',
      },
      body: data,
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({response:responseJson.message})
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _onPressButton() {
    alert('You tapped the button!')
  }

  componentDidMount(){
    this.nameRoomName.focus();
  }


  changeScreen(screenName)
  {
      this.setState((state,props)=>{
         return {screenName:"CREATEROOM"}

      })

  }

  handleChange(event = {}) {
    const name = event.target && event.target.name;
    const value = event.target && event.target.value;
    this.setState({[name]: value});
  }

  render() {

      return (
        <View style={styles.container}> 
          <View style={styles.column}>
            <Text h2> Room Registration</Text>
            <Text value={state.response}>Room Name</Text>
            
            <Text style={styles.label}>Room Name
            </Text>
            <Input
              ref={(input) => { this.nameRoomName = input; }}
              placeholder='Room Name'
              leftIcon={{ type: 'font-awesome', name: 'building' }}
              onChangeText={this.handleChange}
              name="roomName"
            />
            <Text style={styles.label}>Email
            </Text>
            <Input
              placeholder='Email'
              leftIcon={{ type: 'font-awesome', name: 'envelope-square' }}
              name="email"
            />
            <Button
               onPress={()=>{this.submit}}
               title="Submit"
               color="#841584"
             />
          </View>  
        </View>
      );

  }
}

