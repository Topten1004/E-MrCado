import { createStackNavigator } from 'react-navigation-stack'
import CardScreen from '../../../screens/CardScreen'
import PayTransferScreen from '../../../screens/PayTransforScreen'
import PersonalInformationScreen from '../../../screens/PersonalInformationScreen'
import PointScreen from '../../../screens/PointScreen'
import WalletDashboardScreen from '../../../screens/WalletDashboardScreen'

const WalletStackNavigator = createStackNavigator({
  WalletDashboardScreen: {
    screen: WalletDashboardScreen,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerTitle: ''
    })
  },
  PayTransferScreen: {
    screen: PayTransferScreen,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerTitle: ''
    })
  },
  CardScreen: {
    screen: CardScreen,
    navigationOptions: () => ({
      gestureEnabled: false,
      headerTitle: ''
    })
  }
})

WalletStackNavigator.navigationOptions = ({ navigation }) => {
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

export default WalletStackNavigator
