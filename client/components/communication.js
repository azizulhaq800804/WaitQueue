var Communication = function(){}

const objectConstructor = ({}).constructor;
Communication.get= async(url, callback)=>{
  try {
    let response = await fetch('url');
    let result = await response.json();
    callback(null, result);
    // do something with result
  } catch(e) {
    callback(e, null);
  
  }
}


Communication.post = async(url, data, token="", callback ) =>{
  try {
    let isJson = data.constructor === objectConstructor
    console.log(isJson)
    let response = await fetch(url, {
          method: 'POST',
          headers: {
          Accept: 'application/json',
          'Content-Type': isJson ? 'application/json' : 'multipart/form-data',
          Authorization: 'Bearer ' + token 
          },
        body: isJson ? JSON.stringify(data): data
    });
    let result = await response.json();
   	
   	callback(null, result);

    // do something with result
  } catch(e) {
    console.log(e)
    callback(e, null);
   	
  }

}

/*
Communication.postForm = async(url, data, access_token="", callback) =>{
  try {
    
    let response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + access_token
          },
        body: data
    });
    let result = await response.json();
    
    callback(null, result);

    // do something with result
  } catch(e) {
    console.log(e)
    callback(e, null);
    
  }

}
*/



export {Communication}