import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { Dimensions, I18nManager } from 'react-native'
import MenuDrawer from './MenuDrawer'
import HOME from '../navigation/bottomNavigation/Index'
import INTRO from './bottomNavigation/Stacks/Intro'
const WIDTH = Dimensions.get('window').width
const DrawerConfigs = {
  drawerType: 'front',
  drawerWidth: WIDTH * 0.78,
  headerMode: 'none',
  drawerPosition: I18nManager.isRTL ? 'right' : 'left',
  contentComponent: ({ navigation }) => <MenuDrawer navigation={navigation}
  />
}
const AppDrawer = createDrawerNavigator(
  {
    HOME
  },
  DrawerConfigs
)
export default createAppContainer(
  createSwitchNavigator({
    AuthLoading: INTRO,
    Home: AppDrawer
  })
)
