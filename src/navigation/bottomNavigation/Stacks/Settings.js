import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import SettingsScreen from '../../../screens/SettingsScreen'
import ProductDetails from '../../../screens/ProductDetails'
import RatingAndReviewScreen from '../../../screens/RatingAndReviewScreen'
import MyFavorites from '../../../screens/MyFavorites'
import MyAccountScreen from '../../../screens/MyAccountScreen'
import AdressesScreen from '../../../screens/AdressesScreen'
import MyOrdersScreen from '../../../screens/MyOrdersScreen'
import OrderDetail from '../../../screens/OrderDetail'
import RewardPoints from '../../../screens/RewardPoints'
import WalletScreen from '../../../screens/WalletScreen'
import ContactUsScreen from '../../../screens/ContactUsScreen'
import AboutScreen from '../../../screens/AboutScreen'
import IntroScreen from '../../../screens/IntroScreen'
import SearchScreen from '../../../screens/SearchScreen'
import TrackLocationScreen from '../../../screens/TrackLocationScreen'
import CurrencyScreen from '../../../screens/CurrencyScreen'
import LanguageScreen from '../../../screens/LanguageScreen'
import LOGIN from '../../../screens/LoginScreen'
import TermAndServiceScreen from '../../../screens/TermAndServiceScreen'
import PrivacyPolicyScreen from '../../../screens/PrivacyPolicyScreen'
import RefundPolicy from '../../../screens/RefundPolicy'
import ShoppingCartIcon1 from '../../../common/ShoppingCartIcon1'
import NewestScreen from '../../bottomNavigation/Stacks/Newest'
import ChangePassScreen from '../../../screens/ChangePassScreen'
import WebViewScreen from '../../../screens/WebViewScreen'
import SearchFilterClass from '../../../common/SearchFilterClass'

/// ////////////////////////////////////////////////// Home Stack Start
const AccountStackNavigator = createStackNavigator(
  {
    SettingsScreen: {
      screen: SettingsScreen
    },
    ChangePassScreen: {
      screen: ChangePassScreen,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    },
    WebViewScreen: {
      screen: WebViewScreen,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerRight: null
      })
    },
    SearchFilterClass: {
      screen: SearchFilterClass,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerRight: null
      })
    },
    TrackLocationScreen: {
      screen: TrackLocationScreen,
      navigationOptions: () => ({
        gestureEnabled: true
      })
    },
    ProductDetails: {
      screen: ProductDetails,
      navigationOptions: () => ({ gestureEnabled: true })
    },
    RatingAndReviewScreen: {
      screen: RatingAndReviewScreen,
      navigationOptions: () => ({
        gestureEnabled: true
      })
    },
    CurrencyScreen: {
      screen: CurrencyScreen,
      navigationOptions: () => ({ gestureEnabled: true })
    },
    LanguageScreen: {
      screen: LanguageScreen,
      navigationOptions: () => ({ gestureEnabled: true })
    },
    MyFavorites: {
      screen: MyFavorites,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerShown: false
      })
    },
    MyAccountScreen: {
      screen: MyAccountScreen,
      navigationOptions: () => ({ gestureEnabled: true })
    },
    AdressesScreen: {
      screen: AdressesScreen,
      navigationOptions: () => ({ gestureEnabled: true })
    },
    MyOrdersScreen: {
      screen: MyOrdersScreen,
      navigationOptions: () => ({ gestureEnabled: true })
    },
    OrderDetail: {
      screen: OrderDetail,
      navigationOptions: () => ({ gestureEnabled: true })
    },
    RewardPoints: {
      screen: RewardPoints,
      navigationOptions: () => ({ gestureEnabled: true })
    },
    WalletScreen: {
      screen: WalletScreen,
      navigationOptions: () => ({ gestureEnabled: true })
    },
    ContactUsScreen: {
      screen: ContactUsScreen,
      navigationOptions: () => ({ gestureEnabled: true })
    },
    AboutScreen: {
      screen: AboutScreen,
      navigationOptions: () => ({ gestureEnabled: true })
    },
    IntroScreen: {
      screen: IntroScreen,
      navigationOptions: () => ({ gestureEnabled: true })
    },
    NewestScreen: {
      screen: NewestScreen,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    },
    SearchScreen: {
      screen: SearchScreen,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerShown: false
      })
    },
    LOGIN: {
      screen: LOGIN,
      navigationOptions: () =>
        ({
          gestureEnabled: false
        })

    },
    TermAndServiceScreen: {
      screen: TermAndServiceScreen,
      navigationOptions: () =>
        ({
          gestureEnabled: false
        })

    },
    PrivacyPolicyScreen: {
      screen: PrivacyPolicyScreen,
      navigationOptions: () =>
        ({
          gestureEnabled: false
        })

    },
    RefundPolicy: {
      screen: RefundPolicy,
      navigationOptions: () =>
        ({
          gestureEnabled: false
        })
    }
  }
)
AccountStackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      tabBarVisible = false
    })
  }

  return {
    tabBarVisible
  }
}
export default AccountStackNavigator
