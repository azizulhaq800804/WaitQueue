var Communication = function(){}

const objectConstructor = ({}).constructor;
Communication.get= async(url, token, callback)=>{
  
  try {
    let response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token 
          }
    });
    let result = await response.json();
    callback(null, result);
    // do something with result
  } catch(e) {
    console.log(e)
    callback(e, null);
  
  }
}


Communication.post = async(url, data, token="", callback ) =>{
  try {
    let isJson = data.constructor === objectConstructor
    
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


const request = async ({url, method = 'GET', params, body, responseType = 'json', headers = {}, token, callback})=>{
    const escape = (data, encode = encodeURIComponent)=>Object.keys(data||{}).reduce((pairs, key)=>{
        for (let value of [].concat(data[key]))
            pairs.push([`${key}`, `${value}`]);
        return pairs;
    }, []).map(pair=>pair.map(encode).join('=')).join('&');

    if (Object.keys(params||{}).length)
        url += '?'+escape(params);
    
    if (method=='POST' && typeof body=='object')
    {
        if (body instanceof FormData)
            headers['Content-Type'] = 'multipart/form-data';
        else
        {
            body = escape(body);
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
    }

    headers['Authorization'] = "Bearer " + token

    let response = null
    
    try{
      let {statusCode, request} = await new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.withCredentials = true;
        xhr.responseType = {json: 'text'}[responseType]||responseType;
        xhr.onload = ()=>{ console.log("Resolved"); resolve({statusCode: xhr.status, request: xhr})};
        xhr.onerror = ()=>{ console.log("Error");reject(new TypeError('Network request failed'))};
        xhr.ontimeout = ()=>{console.log("Timeout");reject(new TypeError('Network request timed out'))};
        for (let key in headers)
            xhr.setRequestHeader(key, headers[key]);
        xhr.send(body||null);
      });
    
     
      if (statusCode<200 || statusCode>=400)
        throw new Error(`network request failed with ${statusCode}: ${url}`);

      switch(responseType)
      {
        case 'json':
            console.log(statusCode)
            response = JSON.parse(request._response);
            console.log(response)
            break
        case 'text':
            response = request._response;
            break
        case 'request':
            response = request;
            break
      }
  
    callback(null, response);
  }  
  catch(err)
  {
       console.log("test")
       console.log(err)
       callback(err, null)   
  }


};

Communication.get1 = (url, opt = {})=>request({...opt, url, body: null});
Communication.postForm = (url, ...args)=>request({...args[1]||{}, url, method: 'POST', body: args[0], token:args[2], callback:args[3]});




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