import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import SearchScreen from '../../../screens/SearchScreen'
import NewestScreen from '../../bottomNavigation/Stacks/Newest'
import LoginScreen from '../../../screens/LoginScreen'
import ProductDetails from '../../../screens/ProductDetails'
import TrackLocationScreen from '../../../screens/TrackLocationScreen'
import RatingAndReviewScreen from '../../../screens/RatingAndReviewScreen'
import MenuIcon from '../../../common/MenuIcon'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator(
  {
    SearchScreen: {
      screen: SearchScreen,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    },
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: ({ navigation }) => ({
        gestureEnabled: false
      })
    },
    NewestScreen: {
      screen: NewestScreen,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    },
    TrackLocationScreen: {
      screen: TrackLocationScreen,
      navigationOptions: () => ({
        gestureEnabled: true
      })
    },
    RatingAndReviewScreen: {
      screen: RatingAndReviewScreen,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    },
    ProductDetails: {
      screen: ProductDetails,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    }
  }
)

export default HomeStackNavigator
