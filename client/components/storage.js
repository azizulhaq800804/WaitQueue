import {AsyncStorage} from 'react-native';

var Storage = function(){
   this.created_at = new Date();
};


Storage.storeData = async (key, value, callback ) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  	callback(null)

  } catch (error) {
  	callback(error)
	// Error saving data
  }
};


Storage.retrieveData = async (key, callback) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value != null) {

      // We have data!!
      callback( null, JSON.parse(value));
    }
    else
      callback(null, null); 
  } catch (error) {
    // Error retrieving data
    callback(error, null);
  }
};

Storage.removeData = async (key, callback) => {
  try {
    const value = await AsyncStorage.removeItem(key);
    callback(null);

  }
  
   catch (error) {
    // Error retrieving data
    callback(error);
  }
};

export  {Storage};