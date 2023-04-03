import React, { PureComponent } from 'react'
import {
  StyleSheet, // Renders text
  TouchableOpacity, // Pressable container
  View,
  Dimensions,
  I18nManager,
  Platform,
  Text
} from 'react-native'
import { appTextStyle } from '../common/Theme.style'
import ShoppingCartIcon3 from '../common/ShoppingCartIcon3'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createSelector } from 'reselect'
const WIDTH = Dimensions.get('window').width
class Header extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      searchText: ''
    }
  }

  render ({ language, category } = this.props) {
    return (
      <View style={[styles.headerView, {
        backgroundColor: this.props.themeStyle.primaryBackgroundColor
      }]}>
        {!category
          ? <Ionicons
            name={'notifications-outline'}
            style={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize + 6 }}
          />
          : null}

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('SearchScreen')
          }}
          style={[styles.iconStyle, {
            backgroundColor: this.props.themeStyle.secondryBackgroundColor,
            width: !category ? WIDTH * 0.7 : WIDTH * 0.85
          }]}>
          <Ionicons
            name={'search'}
            style={{ color: this.props.themeStyle.iconPrimaryColor, fontSize: 18 }}
          />
          <Text style={[styles.textinputStyle, {
            width: !category ? WIDTH * 0.6 : WIDTH * 0.75,
            fontSize: appTextStyle.mediumSize,
            color: this.props.themeStyle.iconPrimaryColor,
            backgroundColor: this.props.themeStyle.secondryBackgroundColor
          }]}>{language['What are you looking for?']}</Text>
        </TouchableOpacity>

        <ShoppingCartIcon3 props={this.props} />

      </View>
    )
  }
}
const getTheme = (state) => state.appConfig.themeStyle
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state)
})
export default connect(mapStateToProps, null)(Header)

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: '2.5%',
    paddingBottom: '2.5%'
  },
  iconStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: appTextStyle.customRadius - 3,
    padding: Platform.OS === 'ios' ? 3 : 0
  },
  textinputStyle: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    fontFamily: appTextStyle.fontFamily
  },
  innerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH * 0.80,
    borderRadius: appTextStyle.customRadius - 3,
    padding: Platform.OS === 'ios' ? 3 : 0
  }
})
