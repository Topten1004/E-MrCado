import { createStackNavigator } from 'react-navigation-stack'
import Home1Screen from '../../../screens/Home'
import TermAndServiceScreen from '../../../screens/TermAndServiceScreen'
import PrivacyPolicyScreen from '../../../screens/PrivacyPolicyScreen'
import RefundPolicy from '../../../screens/RefundPolicy'
import LoginScreen from '../../../screens/LoginScreen'
import Category from '../../../screens/Category2Screen'
import NewestScreen from '../../bottomNavigation/Stacks/Newest'
import ProductDetails from '../../../screens/ProductDetails'
import RatingAndReviewScreen from '../../../screens/RatingAndReviewScreen'
import DemoScreen from '../../../screens/DemoScreen'
import SearchScreen from '../../../screens/SearchScreen'
import TrackLocationScreen from '../../../screens/TrackLocationScreen'
import CartScreen from '../../../screens/CartScreen'
import ThankUScreen from '../../../screens/ThankUScreen'
import ShippingMethodScreen from '../../../screens/ShippingMethodScreen'
import ShippingAddressScreen from '../../../screens/ShippingAddressScreen'
import OrderScreen from '../../../screens/OrderScreen'
import MyOrdersScreen from '../../../screens/MyOrdersScreen'
import OrderDetail from '../../../screens/OrderDetail'
import MapScreen from '../../../screens/MapScreen'
import WebViewScreen from '../../../screens/WebViewScreen'
import SearchFilterClass from '../../../common/SearchFilterClass'
import ProductDetailScreen from '../../../screens/ProductDetailScreen'

/// ////////////////////////////////////////////////// Home Stack Start
const HomeStackNavigator = createStackNavigator(
  {
    Home1Screen: {
      screen: Home1Screen,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerShown: false
      })
    },
    ProductDetailScreen: {
      screen: ProductDetailScreen,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerShown: true,
        headerTitle: ''
      })
    },
    WebViewScreen: {
      screen: WebViewScreen,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerRight: null
      })
    },
    MapScreen: {
      screen: MapScreen,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerRight: null
      })
    },
    SearchScreen: {
      screen: SearchScreen,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerShown: false
      })
    },
    TermAndServiceScreen: {
      screen: TermAndServiceScreen,
      navigationOptions: () =>
        ({
          gestureEnabled: false
        })

    },
    SearchFilterClass: {
      screen: SearchFilterClass,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerRight: null
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

    },
    DemoScreen: {
      screen: DemoScreen,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    },
    Category: {
      screen: Category,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerShown: false
      })
    },
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    },
    ProductDetails: {
      screen: ProductDetails,
      navigationOptions: () => ({
        gestureEnabled: false,
        tabBarVisible: false,
        drawerLockMode: 'locked-closed'

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
    NewestScreen: {
      screen: NewestScreen,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    },
    CartScreen: {
      screen: CartScreen,
      navigationOptions: () => ({
        gestureEnabled: false,
        headerShown: false
      })
    },
    MyOrdersScreen: {
      screen: MyOrdersScreen,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    },
    OrderDetail: {
      screen: OrderDetail,
      navigationOptions: () => ({
        gestureEnabled: false
      })
    },
    ThankUScreen: {
      screen: ThankUScreen,
      navigationOptions: () => ({ gestureEnabled: false })
    },
    ShippingAddressScreen: {
      screen: ShippingAddressScreen,
      navigationOptions: () => ({ gestureEnabled: false })
    },
    ShippingMethodScreen: {
      screen: ShippingMethodScreen,
      navigationOptions: () => ({ gestureEnabled: false })
    },
    OrderScreen: {
      screen: OrderScreen,
      navigationOptions: () => ({ gestureEnabled: false })
    }
  }
)

HomeStackNavigator.navigationOptions = ({ navigation }) => {
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

export default HomeStackNavigator
