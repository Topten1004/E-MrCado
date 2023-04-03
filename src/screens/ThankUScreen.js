import React, { PureComponent } from 'react'
import { CardStyleInterpolators } from 'react-navigation-stack'
import {
  Text, View, TouchableOpacity, Dimensions, I18nManager,
  StyleSheet
} from 'react-native'
import { Icon } from 'native-base'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { appTextStyle } from '../common/Theme.style'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { NavigationActions, StackActions } from 'react-navigation'

const WIDTH = Dimensions.get('window').width
class News extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      gestureEnabled: false,
      drawerLockMode: 'locked-closed',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: colorProps,
        elevation: 0,
        borderBottomWidth: 0,
        shadowOpacity: 0
      },
      headerTintColor: iconColor,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 6
      },
      headerForceInset: { top: 'never', vertical: 'never' },
      headerLeft: () => (
        <Icon
          onPress={() => {
            navigation.popToTop()
          }}
          name={!I18nManager.isRTL ? 'arrow-back' : 'arrow-forward'}
          style={{
            color: iconColor,
            fontSize: 25,
            padding: 5,
            paddingLeft: 16,
            paddingRight: 16,
            marginRight: 16
          }}
        />
      )
    }
  };

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language.OrderPlace,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  render () {
    return (
      <View style={[styles.container, {
        backgroundColor: this.props.themeStyle.secondryBackgroundColor
      }]}>
        <FontAwesome name={'check-circle'}
          style={{ color: this.props.themeStyle.primary, fontSize: 150 }} />
        <View>
          <Text style={[styles.congText, {
            fontFamily: appTextStyle.fontFamily,
            color: this.props.themeStyle.primary
          }]}>
            {
              this.props.language.Congratulations
            }
          </Text>
          <Text style={[styles.orderText, {
            fontFamily: appTextStyle.fontFamily,
            color: this.props.themeStyle.iconPrimaryColor,
            fontSize: appTextStyle.largeSize
          }]}>
            {
              this.props.language[
                'Your Order Has been Placed'
              ]
            }
          </Text>
          <TouchableOpacity
            style={[styles.viewOrderBtn, {
              backgroundColor: this.props.themeStyle.primary
            }]}
            onPress={() => this.props.navigation.navigate('MyOrdersScreen', {
              selectedTab: '1'
            })}
          >
            <Text style={{
              fontFamily: appTextStyle.fontFamily,
              fontSize: appTextStyle.largeSize + 1,
              color: this.props.themeStyle.textTintColor,
              fontWeight: 'bold'
            }}>
              {this.props.language.ViewOrders}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.continueBtn, {
              backgroundColor: this.props.themeStyle.primaryBackgroundColor,
              borderColor: this.props.themeStyle.primary
            }]}
            onPress={() => {
              const resetAction = StackActions.reset({
                key: null,
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: this.props.navigation.dangerouslyGetParent().state.routes[0].routeName })
                ]
              })
              this.props.navigation.dispatch(resetAction)
            }}
          >
            <Text style={{
              fontFamily: appTextStyle.fontFamily,
              fontSize: appTextStyle.largeSize + 1,
              color: this.props.themeStyle.primary
            }}>
              {this.props.language['continue shopping']}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
const getTheme = (state) => state.appConfig.themeStyle
const getLanguage = (state) => state.appConfig.languageJson
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
/// ///////////////////////////////////////////////
const mapStateToProps = state => {
  return {
    themeStyle: getThemeFun(state),
    language: getLanguageFun(state)

  }
}

export default connect(
  mapStateToProps,
  null
)(News)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50
  },
  congText: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10
  },
  orderText: {
    marginTop: -2,
    marginBottom: 10,
    alignSelf: 'center'
  },
  viewOrderBtn: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH * 0.8,
    marginTop: 16,
    borderRadius: appTextStyle.customRadius
  },
  continueBtn: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: appTextStyle.customRadius,
    width: WIDTH * 0.8,
    marginTop: 16,
    borderWidth: 1
  }
})
