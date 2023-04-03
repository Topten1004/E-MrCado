import React, { Component } from 'react'
import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  UIManager,
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar,
  FlatList,
  I18nManager
} from 'react-native'
import { createSelector } from 'reselect'
import ImageLoad from '../common/RnImagePlaceH'
import { ListItem } from 'native-base'
import { appTextStyle } from '../common/Theme.style.js'
import ExpandableListView from './ExpandableListView'
import { connect } from 'react-redux'
const pageNumbers = [1]
const WIDTH = Dimensions.get('window').width
const Height = Dimensions.get('window').height
const DrawerWidth2 = WIDTH * 0.78

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar backgroundColor={backgroundColor} {...props} />
  </View>
)
class App extends Component {
  constructor (props) {
    super(props)

    this.state = { AccordionData: [], orientation: '', expend: true }
  }

  getOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      this.setState({ orientation: 'portrait' })
    } else {
      this.setState({ orientation: 'landscape' })
    }
  }

  componentDidMount () {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    let array = []
    array = [
      {
        expanded: false,
        categoryName: {
          id: 3,
          name: 'SHOP',
          iconName: 'cart',
          jsonName: this.props.language.Shop,
          subCategory: [
            {
              id: 7,
              jsonName: this.props.language.Newest,
              name: 'NEWEST',
              iconName: 'open'
            },
            {
              id: 8,
              jsonName: this.props.language.Deals,
              name: 'DEALS',
              iconName: 'shirt'
            }, // open arrow-dropup-circle
            {
              id: 9,
              jsonName: this.props.language[
                'Top Seller'
              ],
              name: 'TOPSELLER',
              iconName: 'star'
            }, // open arrow-dropup-circle
            {
              id: 10,
              jsonName: this.props.language[
                'Most Liked'
              ],
              name: 'MOSTLIKED',
              iconName: 'star'
            }
          ]
        }
      }
    ]
    this.getOrientation()
    this.dimensionsSubscription = Dimensions.addEventListener('change', this.getOrientation)
  }

  componentWillUnmount () {
    this.orientation = null
    this.AccordionData = null
    this.dimensionsSubscription.remove()
  }

  updateLayout = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    const array = [...this.state.AccordionData]
    array[index].expanded = !array[index].expanded

    this.setState(() => ({
      AccordionData: array,
      expend: false
    }))
  }

  setExpened = (value) => {
    this.setState({ expend: value })
  }

  navCatFun = item => {
    const string = item
    const newString = string.replace(/\s+/g, '') // "thiscontainsspaces"
    if (
      newString === 'Sale' ||
      newString === 'Deals' ||
      newString === 'Top Seller' ||
      newString === 'Most Liked'
    ) {
      this.props.navigation.navigate('NewestScreen', {
        id: '',
        name: '', /// ////////////////////////////////////////////////
        sortOrder: newString
      })
    } else {
    }
  }

  categoryFun (text, iconName, tempNo, imageTemp, globalText) {
    return (
      <ListItem noIndent={true}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={
            tempNo === 0
              ? this.navCatFun.bind(this, text)
              : this.navCatFun.bind(this, `${text} ${tempNo}`)
          }>
          <View
            style={{
              width: WIDTH * 0.4,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
            <ImageLoad
              key={0}
              style={{
                width: 22,
                height: 22,
                marginRight: I18nManager.isRTL ? 8 : 4,
                marginLeft: 0
              }}
              loadingStyle={{ size: 'large', color: this.props.themeStyle.primary }}
              placeholder={false}
              ActivityIndicator={true}
              placeholderStyle={{ width: 0, height: 0 }}
              source={imageTemp}
            />
            <Text style={{
              textAlign: 'left',
              color: this.props.themeStyle.textColor,
              fontSize: appTextStyle.largeSize,
              fontFamily: appTextStyle.fontFamily,
              fontWeight: '500',
              marginLeft: I18nManager.isRTL ? (Platform.OS === 'ios' ? 0 : 7) : 9
            }}>{globalText}</Text>
          </View>
        </TouchableOpacity>
      </ListItem>
    )
  }

  static getDerivedStateFromProps (props, state) {
    return {
      AccordionData: props.sortCategory
    }
  }

  render () {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: this.props.themeStyle.primaryBackgroundColor
      }}>

        <View style={[styles.headerView, {
          backgroundColor: this.props.themeStyle.primaryBackgroundColor
        }]}>
          <Text style={[styles.headingText, {
            color: this.props.themeStyle.textColor,
            fontSize: appTextStyle.largeSize + 2,
            fontFamily: appTextStyle.fontFamily
          }]}>
            {Object.keys(this.props.userData).length !== 0
              ? this.props.language.Hello + ' ' +
              this.props.userData.first_name + '!'
              : this.props.language.Hello + ' ' + this.props.language.Guest}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 0
          }}>
          <FlatList
            data={pageNumbers}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ backgroundColor: this.props.themeStyle.primaryBackgroundColor }}
            keyExtractor={pageNumber => pageNumber.toString()}
            extraData={this.state}
            renderItem={() => (
              <View>
                {this.state.AccordionData.map((item, key) => (
                  <ExpandableListView
                    key={key}
                    categories={this.props.categories}
                    onClickFunction={this.updateLayout.bind(this, key)}
                    item={item}
                    navigation={this.props.navigation}
                    count={key}
                    setExpened={this.setExpened}
                    expend={this.state.expend}
                  />
                ))}
                {/* ////////////////////////////////////////// */}

              </View>
            )}
          />
        </View>
      </View>
    )
  }
}
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : 0
const getLanguage = (state) => state.appConfig.languageJson
const getTheme = (state) => state.appConfig.themeStyle
const getCategories = (state) => state.getCategories.categories
const getSortCategory = (state) => state.getCategories.sortCategory
const getUserData = (state) => state.userData.user

const getUserDataFun = createSelector(
  [getUserData],
  (getUserData) => {
    return getUserData
  }
)
const getSortCategoryFun = createSelector(
  [getSortCategory],
  (getSortCategory) => {
    return getSortCategory
  }
)
const getCategoriesFun = createSelector(
  [getCategories],
  (getCategories) => {
    return getCategories
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
  categories: getCategoriesFun(state),
  sortCategory: getSortCategoryFun(state),
  userData: getUserDataFun(state)

  // isLoading
})

export default connect(mapStateToProps, null)(App)
const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT
  },
  tabComponents: {
    flexDirection: 'row',
    alignContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingLeft: 13
  },
  headingText: {
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'left'
  },
  textImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    height: Platform.OS === 'ios' ? 103 : 97,

    width: DrawerWidth2,
    zIndex: 9,
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    padding: 15
  },
  headerView: {
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: 3,
    marginBottom: 5,
    paddingLeft: 10
  },
  headerText: {
    textAlign:
      Platform.OS === 'ios' ? 'left' : I18nManager.isRTL ? 'right' : 'left',
    fontSize: 21,
    padding: 10,
    paddingTop: Platform.OS === 'ios' ? 8 : 10,
    alignSelf: 'center'
  },
  headerIcon: {
    paddingTop: Platform.OS === 'ios' ? 0 : 10,
    fontSize: 23
  },
  iconContainer: {
    paddingLeft: 10,
    paddingTop: 10,
    marginRight: 5
  }
})
