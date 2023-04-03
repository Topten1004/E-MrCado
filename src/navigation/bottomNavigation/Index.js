import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs'
import Home from './Stacks/HomeTemp'
import Categories from './Stacks/CategoryTemp'
import INTRO from './Stacks/Intro'
import Account from './Stacks/Settings'
import Profile from './Stacks/Profile'
import { store } from '../../redux/store/index'
import {
  Platform,
  Image
} from 'react-native'

const TabBarComponent = props => <BottomTabBar {...props} />
AppDrawer = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: () => ({
        tabBarLabel: store.getState().appConfig.languageJson.Home,
        tabBarIcon: ({ focused }) => {
          const yellow = require('../../images/tabbar/home_active.png')
          const white = require('../../images/tabbar/home_inactive.png')
          return <Image
            resizeMode="contain"
            style={{
              width: 30,
              height: 30
            }}
            source={focused ? yellow : white}
          />
        }
      })
    },
    Categories: {
      screen: Categories,
      navigationOptions: () => ({
        tabBarLabel: store.getState().appConfig.languageJson.Categories,
        tabBarIcon: ({ focused }) => {
          const yellow = require('../../images/tabbar/category_active.png')
          const white = require('../../images/tabbar/category_inactive.png')
          return <Image
            resizeMode="contain"
            style={{
              width: 30,
              height: 30
            }}
            source={focused ? yellow : white}
          />
        }
      })
    },
    Profile: {
      screen: Profile,
      navigationOptions: () => ({
        tabBarLabel: store.getState().appConfig.languageJson.Profile,
        tabBarIcon: ({ focused }) => {
          const yellow = require('../../images/tabbar/profile_active.png')
          const white = require('../../images/tabbar/profile_inactive.png')
          return <Image
            resizeMode="contain"
            style={{
              width: 30,
              height: 30
            }}
            source={focused ? yellow : white}
          />
        }
      })
    },
    Account: {
      screen: Account,
      navigationOptions: () => ({
        tabBarLabel: store.getState().appConfig.languageJson.Search,
        tabBarIcon: ({ focused }) => {
          const yellow = require('../../images/tabbar/search_active.png')
          const white = require('../../images/tabbar/search_inactive.png')
          return <Image
            resizeMode="contain"
            style={{
              width: 30,
              height: 30
            }}
            source={focused ? yellow : white}
          />
        }
      })
    },
    Bag: {
      screen: Account,
      navigationOptions: () => ({
        tabBarLabel: store.getState().appConfig.languageJson.Bag,
        tabBarIcon: ({ focused }) => {
          const yellow = require('../../images/tabbar/cart_active.png')
          const white = require('../../images/tabbar/cart_inactive.png')
          return <Image
            resizeMode="contain"
            style={{
              width: 30,
              height: 30
            }}
            source={focused ? yellow : white}
          />
        }
      })
    }
  },
  {
    tabBarComponent: props => (
      <TabBarComponent
        {...props}
        activeTintColor={store.getState().appConfig.themeStyle.secondry}
        inactiveTintColor={store.getState().appConfig.themeStyle.iconPrimaryColor}
        style={{
          backgroundColor: store.getState().appConfig.themeStyle.primary,
          borderTopWidth: 0, // remove top border in android
          elevation: 9,
          shadowColor: store.getState().appConfig.themeStyle.primary,
          shadowOpacity: 0.2,
          shadowOffset: {
            height: 0
          },
          shadowRadius: 4
        }}
        labelStyle={{
          marginTop: Platform.OS === 'android' ? -7 : -2,
          marginBottom: Platform.OS === 'android' ? 9 : 0
        }}
      />
    )
  }
)

export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: INTRO,
    App: AppDrawer
  })
)
