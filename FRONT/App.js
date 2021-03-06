import React from 'react';

// Screens Communs
import FirstScreen from './Screens/FirstScreen';
import SignInScreen from './Screens/SignInScreen';
import SignUpScreen from './Screens/SignUpScreen';

import CatalogueCaviste from './ScreensCaviste/CatalogueCaviste';
import FavoriteCaviste from './ScreensCaviste/FavoriteCaviste';
import MailmainC from './ScreensCaviste/MailmainC';
import MailwriteC from './ScreensCaviste/MailwriteC';
import MailreadC from './ScreensCaviste/MailreadC';
import ProfilCaviste from './ScreensCaviste/ProfilCaviste';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import userstatus from './reducers/userstatus';
import token from './reducers/token';
import message from './reducers/messageRead';
import messageSend from './reducers/messageSend';

const store = createStore(combineReducers({ userstatus, token, message, messageSend }));

// STACK-NAVIGATION
var BottomNavigator = createBottomTabNavigator({
  Profil: ProfilCaviste,
  Catalogue: CatalogueCaviste,
  Favoris: FavoriteCaviste,
  Main : MailmainC,
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        var iconName;
        if (navigation.state.routeName == 'Profil') {
          iconName = 'ios-person';
        } else if (navigation.state.routeName == 'Catalogue') {
          iconName = 'ios-home';
        } else if (navigation.state.routeName == 'Main') {
          iconName = 'md-chatboxes';
        } else if (navigation.state.routeName == 'Favoris') {
          iconName = 'ios-wine';
        }

        return <Icon name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#FFAE34',
      inactiveTintColor: '#FFFFFF',
      showLabel: false,
      adaptive: true,
      style: {
        backgroundColor: '#FCDF23',
        height: 40,
        shadowColor: 'transparent',
        borderColor: '#FCDF23',

      }
    }
  });

var StackNavigator = createStackNavigator({
  First: FirstScreen,
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
  Favoris: FavoriteCaviste,
  Read : MailreadC,
  Write: MailwriteC,
  Catalogue: CatalogueCaviste,

  BottomNavigator: BottomNavigator,
},

  { headerMode: 'none' }
);

const AppContainer = createAppContainer(StackNavigator);

function App() {

  return (

    <Provider store={store}>
      <AppContainer />
    </Provider>
  )
}

export default App;
