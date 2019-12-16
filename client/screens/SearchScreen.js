import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, Platform } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import {Config} from "../config"
import {styles} from '../styles'
import Category from "react-native-category";
import {Communication} from "../components/communication"
import { NavigationEvents } from 'react-navigation';

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      loading: false,
      data: [],
      page: 0,
      seed: 1,
      error: null,
      refreshing: false,
      hasScrolled: false,
      search_str:"",
      regiion:null, 
      latitude:0, 
      longitude:0,
      category:0,
      categories:[]
    };
    
  }
  
  componentWillMount()
  {
   

  }

  initialize = ()=>{
     // Retrive initial data at once
     let url = Config.PROTOCOL + Config.HOST +":" + Config.PORT + Config.SERVICE_CAT_CITY_COUNTRY
     console.log(url)
     Communication.get(url, "", (error, response)=>{
       if (error)
         this.setState({response:"Failed to retrieve data during initialization"})
       else
       {
         this.setState({categories:response.categories})
       }  
     })  

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync((err,location)=>{
        if(err) this.makeRemoteRequest() 
        else this.setState({ location, latitude:location.coords.latitude, longitude:location.coords.longitude }, this.makeRemoteRequest);
      });
    }

  }

  navigationFocus = ()=>{
    // this.initialize()

  }  
  componentDidMount() {
    this.initialize()    
  }

  

  _getLocationAsync = async (callback) => {
    
    try{
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
        callback({}, null)
      }

      let location = await Location.getCurrentPositionAsync({});
      callback(null, location)
    }
    catch(err){console.log(err); callback(err, null)}  
  };

  

  makeRemoteRequest = () => {
     const { page, seed,search_str, latitude, longitude, category } = this.state;
    // const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    //let url = Config.PROTOCOL + Config.HOST +":" + Config.PORT + Config.SERVICE_LOGIN + 
    const url = `${Config.PROTOCOL}${Config.HOST}:${Config.PORT}${Config.SERVICE_SEARCH}?page=${page}&search_string=${search_str}&latitude=${latitude}&longitude=${longitude}&category=${category}`
    console.log(url)
    this.setState({ loading: true});
    
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 0 ? res.data : [...this.state.data, ...res.data],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 0,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = ({ distanceFromEnd }) => {
    
    if(!this.state.hasScrolled){ return null; }

    if(!this.onEndReachedCalledDuringMomentum)
    this.setState(
      {
        page: this.state.page + 1,
        hasScrolled:false
      },
      () => {
        this.makeRemoteRequest();
        this.onEndReachedCalledDuringMomentum = true;

      }
    );
  };

  onScroll = () => {
    this.setState({hasScrolled: true})
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
   // return <SearchBar placeholder="Type Here..." lightTheme round />;
    return ""
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  //func call when click item category
  _itemChoose = (item)=> {

      // make sure o is the id for the all category
      item && item.id !=0 && this.setState(
              {
                page: 0,
                seed: this.state.seed + 1,
                refreshing: true,
                category:item.id
                
              },
              () => {
                this.makeRemoteRequest();
              }
            ); 
  }
  
  updateSearch = search_str => {
    this.setState(
      {
        page: 0,
        seed: this.state.seed + 1,
        refreshing: true,
        search_str
      },
      () => {
        this.makeRemoteRequest();
      }
    );
    
       
  };

  showDetail = (item) => {
    this.props.navigation.navigate("ChamberDetail", {chamber:item})
  }

  render() {
    let {data, categories} = this.state
    return (
      <View> 
        <NavigationEvents
                onDidFocus={(payload) => this.navigationFocus(payload)}
          /> 
        { categories.length > 0  &&
          <Category
            data={this.state.categories}    
            itemSelected={(item) => this._itemChoose(item)}
            itemText={'title'}  //set attribule of object show in item category
            // indexSelected={this.state.category}
          />
        }
        <SearchBar
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          value={this.state.search_str}
        ></SearchBar>

        {  typeof data == "object" && data.length > 0 &&
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <ListItem
                roundAvatar
                title={`${item.chamber_name} ${item.doctor_name}`}
                subtitle={`${item.address} ${item.city}`}
                leftAvatar={{source:{ uri: `${Config.PROTOCOL}${Config.HOST}:${Config.PORT}${Config.IMAGE_PATH}${item.thumbnail}` }}}
                containerStyle={{ borderBottomWidth: 0 }}
                chevron
                onPress={() => this.showDetail(item)}
              />
            )}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={this.renderSeparator}
            // ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
            onScroll={this.onScroll}
            contentContainerStyle={{ paddingBottom: 50}}
          />
        }  
      </View>  
    );
  }
}

SearchScreen.navigationOptions = {
  header: <Text style={{...styles.label, marginTop:'8%'}}>Search for a doctor/chamber</Text>
};
export default SearchScreen;
