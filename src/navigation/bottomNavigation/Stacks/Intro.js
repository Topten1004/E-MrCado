import { createStackNavigator } from 'react-navigation-stack'
import IntroScreen from '../../../screens/IntroScreen'
import NewestScreen from '../../bottomNavigation/Stacks/Newest'
/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator(
  {
    IntroScreen: {
      screen: IntroScreen,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerShown: false,
        drawerLockMode: 'locked-closed'
      })
    },
    NewestScreen: {
      screen: NewestScreen,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    }
  }
)

export default HomeStackNavigator
