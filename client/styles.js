import {StyleSheet} from 'react-native';
export const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   
  },
  scrollViewContainer:{
    flex:1

  },
  buttonContainer: {
    margin: 10
  },
  button: {
    margin:10
  },
  alternativeLayoutButtonContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  row:{
    margin: 10,
    flexDirection: 'row'
  },
  column: {
    margin: 5,
    flexDirection: 'column'
  },
  label:{
    margin:5,
    fontWeight:'bold',
    fontSize:20
  },

  labelButton:{
    fontWeight:'bold',
    fontSize:15,
    color:"#FFFFFF"
  },

  textinput:{
    margin:10
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#841584',
    padding: 10,
    
  },

  error:{
    margin:5,
    fontWeight:'bold',
    fontSize:15,
    color:'red'
  },

  picker:{
    height:50,
    width:250
  }

  });