import React, { PureComponent } from 'react'
import {
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Text
} from 'react-native'
import { createSelector } from 'reselect'
import Toast from 'react-native-easy-toast'
import {
  addSearchValue,
  clearSearchValue
} from '../redux/actions/actions'
import { getUrl, getHttp } from '../common/WooComFetch'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { UIActivityIndicator } from 'react-native-indicators'
import CardTem from '../common/CardTemplate'
import SearchHeader from '../common/SearchHeader'
import Header from '../common/HeaderCustom'
import { connect } from 'react-redux'
import { Icon } from 'native-base'
import themeStyle, { appTextStyle } from '../common/Theme.style'
const WIDTH = Dimensions.get('window').width
class wishListScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerTitleAlign: 'center',
      headerTintColor: iconColor,
      headerStyle: {
        backgroundColor: colorProps,
        elevation: 0,
        borderBottomWidth: 0,
        shadowOpacity: 0
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 6
      },
      headerForceInset: { top: 'never', vertical: 'never' },
      gestureEnabled: false
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language['My Wish List'],
      colorProps: this.props.themeStyle.secondryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  constructor (props) {
    super(props)

    this.state = {
      searchData: [],
      page: 0,
      loading: true,
      refreshing: false,
      isRefreshing: false, // for pull to refresh
      temp: false,
      pageNumber: 1,
      fabB: false,
      globalWishlist: [],
      searchString: ''

    }
    this.toast = null
  }

  onRefreshTemp () {
    this.setState({ isRefreshing: true, page: 0, refreshing: false }, () => {
      this.getProducts()
    }
    )
  }

  temp = () => {
    this.setState(
      {
        refreshing:
          this.state.searchData.length > 9,
        page: this.state.page + 1,
        fabB: this.state.searchData.length > 9
      },
      () => {
        this.getProducts()
      }
    )
  }

  handleScroll (event) {
    if (
      this.state.fabB &&
      event.nativeEvent.contentOffset.y >= 0 &&
      event.nativeEvent.contentOffset.y < 300
    ) {
      this.setState({ fabB: false })
    }
  }

  renderFooter = () => (
    <View
      style={{
        marginBottom: 30,
        marginTop: 10,
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center'
      }}>
      {this.state.refreshing &&
        this.state.searchData.length !== 0 ? (
          <View style={{ height: 20, marginTop: 30 }}>
            <UIActivityIndicator
              size={27}
              count={12}
              color={themeStyle.loadingIndicatorColor}
            />
          </View>
        ) : null}
    </View>
  )

  /// //////////////////////////////////////////
  getProducts = async () => {
    this.setState({ temp: true })
    let url = 'products'
    url += '?limit=' + 10
    url += '&getCategory=1'
    url += '&getDetail=1'
    url += '&language_id=' + this.props.settings.language_id
    url += '&currency=' + this.props.settings.currency_id
    url += '&stock=1'
    url += '&page=' + this.state.page
    url += '&searchParameter=' + this.state.searchString
    const json = await getHttp(getUrl() + url, {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        for (const value of json.data.data) {
          this.state.searchData.push(value)
        }
        this.setState({
          temp: false,
          isRefreshing: false,
          refreshing: false,
          page: this.state.page + 1
        })
      } else {
        this.toast.show(json.data.message)
        this.setState({
          temp: false,
          isRefreshing: false,
          refreshing: false
        })
      }
    } else {
      this.toast.show(json.data.data.message)
      this.setState({
        temp: false,
        isRefreshing: false,
        refreshing: false
      })
    }
  }

  setSearchState = (value) => {
    this.setState({ searchString: value })
  }

  removeSearchState = () => {
    this.setState({ searchString: '' })
  }

  onSearchPress = (searchString) => {
    const temp = searchString
    this.setState({ searchString: '' }, () => {
      this.props.navigation.push('NewestScreen', {
        searchString: temp
      })
    })
  }

  selectedItem (text, key) {
    return (
      <TouchableOpacity
        key={key}
        style={{
          borderWidth: 1,
          padding: 5,
          borderRadius: appTextStyle.customRadius - 15,
          paddingHorizontal: 12,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          borderColor: this.props.themeStyle.iconPrimaryColor,
          margin: 8,
          backgroundColor: this.props.themeStyle.primaryBackgroundColor
        }}
        onPress={() => {
          this.onSearchPress(text)
        }}
      >

        <Text
          numberOfLines={1}
          style={{
            fontSize: appTextStyle.mediumSize,
            fontFamily: appTextStyle.fontFamily,
            color: this.props.themeStyle.textColor
          }}>
          {text}
        </Text>

      </TouchableOpacity>
    )
  }

  render () {
    return (
      <View style={{ flex: 1, backgroundColor: this.props.themeStyle.secondryBackgroundColor }}>
        <Header menuIcon={false} cartIcon={true} navigation={this.props.navigation} backIcon={true} name={this.props.language.Search} />

        <SearchHeader
          addSearchData={this.props.addSearchData}
          th={this}
          onSearchPress={this.onSearchPress} getProducts={this.getProducts} removeSearchState={this.removeSearchState} setSearchState={this.setSearchState} searchString={this.state.searchString} language={this.props.language} navigation={this.props.navigation} />
        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
          position='top'
          positionValue={400}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
        />
        <Text style={[styles.textStyle, {
          fontFamily: appTextStyle.fontFamily,
          color: this.props.themeStyle.iconPrimaryColor
        }]}>
          {this.props.language['Top Searches']}
        </Text>

        <View style={styles.wrapArray}>

          {
            this.props.recentSearch.map((value, key) => (
              this.selectedItem(value, key)
            ))
          }

        </View>

        {this.props.recentSearch.length > 0
          ? <TouchableOpacity
            onPress={() => this.props.removeSearchData(this)}
            style={{
              borderWidth: 1,
              borderColor: this.props.themeStyle.iconPrimaryColor,
              alignSelf: 'center',
              borderRadius: appTextStyle.customRadius
            }}>
            <Text style={{
              fontSize: appTextStyle.mediumSize,
              fontFamily: appTextStyle.fontFamily,
              color: this.props.themeStyle.textColor,
              padding: 6
            }}>
              {this.props.language.Remove}
            </Text>
          </TouchableOpacity>
          : null }

      </View>
    )
  }
}
const getTheme = (state) => state.appConfig.themeStyle
const getLanguage = (state) => state.appConfig.languageJson
const getSettings = (state) => state.settingsCall.settings
const getUserData = (state) => state.userData.user
const getSearchrData = (state) => state.searchData.recentSearch

const getSearchrDataFun = createSelector(
  [getSearchrData],
  (getSearchrData) => {
    return getSearchrData
  }
)

const getUserDataFun = createSelector(
  [getUserData],
  (getUserData) => {
    return getUserData
  }
)

const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
  }
)
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

const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state),
  settings: getSettingsFun(state),
  userData: getUserDataFun(state),
  recentSearch: getSearchrDataFun(state)

})
const styles = StyleSheet.create({
  fabStyle: {
    zIndex: 5,
    position: 'absolute',
    right: 0,
    bottom: 0,
    marginRight: 25,
    marginBottom: 50
  },
  fabView: {
    alignItems: 'center',
    height: 48,
    width: 48,
    borderRadius: 400,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  fabIcon: {
    paddingTop: Platform.OS === 'ios' ? 2 : 0,
    fontSize: 22
  },
  textStyle: {
    fontSize: appTextStyle.largeSize,
    alignSelf: 'center',
    paddingTop: 20
  },
  wrapArray: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    margin: 12

  }
})

const mapDispatchToProps = dispatch => ({
  addSearchData: (value, th) => dispatch(addSearchValue(value, th)),
  removeSearchData: (th) => dispatch(clearSearchValue(th))
})
export default connect(mapStateToProps, mapDispatchToProps)(wishListScreen)
