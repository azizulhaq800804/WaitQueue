fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
       'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then((response) => { 
      if(response.statusText == "OK" && response.status >= 200 && response.status < 300) {
            return response.json()
        } else {
            throw new Error("Server can't be reached!")
        }
     })
    .then((responseJson) => {

      if(responseJson.result == 0)
      {  
        let user = {userid:responseJson.userid, username:responseJson.username}
        Storage.storeData("user", user, function(error)
        {
          if(error)
            this.setState({response:"Error Storing user data"})
          else  
            this.props.navigation.navigate('Dashboard')
        })  
        
      }
      else
        this.setState({response:responseJson.message})
    })
    .catch((error) => {
      console.error(error);
      this.setState({response:"Network Request Failed."})
    });
  