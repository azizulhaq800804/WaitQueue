import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import {Config} from "../config"
import {styles} from '../styles'

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      hasScrolled: false,
      search_str:""
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  updateSearch = search_str => {
    this.setState({ search_str });
  };

  makeRemoteRequest = () => {
    const { page, search_str } = this.state;
    
    //const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    //let url = Config.PROTOCOL + Config.HOST +":" + Config.PORT + Config.SERVICE_LOGIN + 
    const url = `${Config.PROTOCOL}${Config.HOST}:${Config.PORT}${Config.SERVICE_SEARCH}?page=${page}&search_string=${search_str}`
    this.setState({ loading: true });
    
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.data : [...this.state.data, ...res.data],
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
        page: 1,
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

  render() {
    let {data} = this.state
    return (
      <View> 
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
            //contentContainerStyle={{ paddingBottom: 30}}
          />
        }  
      </View>  
    );
  }
}

SearchScreen.navigationOptions = {
  header: <Text style={{...styles.label, marginTop:'8%'}}>Search for a doctor</Text>
};
export default SearchScreen;
