import React, { Component } from 'react';
import { Button, View, Text } from 'react-native';
import CreateRoom from '../components/CreateRoom'
import {styles} from '../styles'
import {Storage} from '../components/storage'
export default class DashboardScreen extends Component {

  constructor(props)
  {
    super(props)
    this.logout = this.logout.bind(this)

  }
  
  state ={screenName:"Dashboard", isLoggedin:false, errormessage:"", user:{}}


  _onPressButton() {
    alert('You tapped the button!')
  }

  changeScreen(screenName)
  {
      this.setState((state,props)=>{
         return {screenName:screenName}

      })

  }

  handler() {
    this.setState({
      isLoggedin: true
    })
  }


  componentDidMount()
  {
    
  }

  componentWillMount()
  {
    if( !this.state.isLoggedin)
    
      Storage.retrieveData('user', (err, value)=>{
        if(err)
        {  //this.setState({errormessage:"Error retrieving local storage data"})
           this.props.navigation.navigate('Login')
        }
        else
        { 
          console.log(value) 
          if(value)
            this.setState({isLoggedin:true, user:value})
          else
            this.props.navigation.navigate('Login')   
        }
      })
  }


  logout(){
    
    Storage.removeData('user', (err)=>{
      if(err)
        this.setState({errormessage:"Error removing local storage data"})
      else 
        { 
          // this.setState({isLoggedin:false})
          this.props.navigation.navigate('Login')
        }
      })
    
  }

  render() {

    let {navigation} = this.props;
    return ( 
        <View style={styles.container}>

          <Text style={styles.error}>{this.state.errormessage}</Text>
          <View style={styles.buttonContainer}>
            <Button
              onPress={()=>navigation.navigate('AddChamber', {user:this.state.user})}
              title="Add Chamber"
            />
           </View> 
           <View style={styles.buttonContainer}>
             <Button
               onPress={()=>this._onPressButton}
               title="Manage Room"
               color="#841584"
             />
           </View>
           <View style={styles.buttonContainer}>
             <Button
               onPress={this.logout}
               title="Logout"
               color="#841584"
             />
           </View>
        </View>
      );
    
  }
}

DashboardScreen.navigationOptions = {
  header: null,
};

