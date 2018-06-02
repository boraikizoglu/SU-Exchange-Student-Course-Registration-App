import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import LoginPage from './LoginPage';
import MainPage from './MainPage';

const pages = {
LoginPage: {
  screen: LoginPage
},
MainPage: {
  screen: MainPage
}
}
export default class App extends React.Component {

  RootStackNavigator = null;

  render() {
    this.RootStackNavigator = StackNavigator(
      pages,
    {
      initialRouteName: 'LoginPage',
      headerMode: "none",
      navigationOptions: {
        gesturesEnabled: false,
      },
    });
    return (
      <this.RootStackNavigator/>
    );
  }
}


