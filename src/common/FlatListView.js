import React, { Component } from 'react'
import {
  View,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  I18nManager
} from 'react-native'
import { createSelector } from 'reselect'
import Icon from 'react-native-vector-icons/FontAwesome'
import CardTem from './CardTemplate'
import { connect } from 'react-redux'
import Loader from 'react-native-easy-content-loader'
import themeStyle, { appTextStyle } from './Theme.style'
import { colorFun } from '../redux/actions/actions'
const WIDTH = Dimensions.get('window').width
class FlatListView extends Component {
  mounted = false
  constructor (props) {
    super(props)
    this.state = {
      objectArray: [],
      isLoading: true,
      spinnerTemp: false,
      recent: false,
      loading: false,
      timeValue: 400,
      productColorCounter: 0
    }
  }

  /// //////
  static getDerivedStateFromProps (props) {
    if (props.dataName === 'RecentlyViewed') {
      return {
        isLoading: false,
        spinnerTemp: false,
        recent: true,
        objectArray: props.recentViewedProducts
      }
    }
    if (
      props.dataName === 'isFeatured' ||
      props.dataName === 'Flash' ||
      props.dataName === 'topSelling' ||
      props.dataName === 'Featured' ||
      props.dataName === 'Vendors'
    ) {
      if (
        props.tabArray !== undefined &&
        props.tabArray !== null &&
        props.tabArray.toString() !== 'NaN'
      ) {
        return {
          objectArray: props.tabArray
        }
      } else {
        return {
          objectArray: []
        }
      }
    }
    return null
  }

  /// //////////////////////////////////
  componentWillUnmount () {
    this.mounted = false
    this.state.objectArray = []
  }

  /// //////////////////////////////
  componentDidMount () {
    this.mounted = true
    if (this.props.dataName === 'Flash' && this.props.tabArray !== undefined) {
      this.state.objectArray = this.props.tabArray
      this.setState({})
    }
    if (this.props.dataName === 'isFeatured' && this.props.tabArray !== undefined) {
      this.state.objectArray = this.props.tabArray
      this.setState({})
    }
    if (this.props.dataName === 'topSelling' && this.props.tabArray !== undefined) {
      this.state.objectArray = this.props.tabArray
      this.setState({})
    }
    if (
      this.props.dataName === 'Featured' &&
      this.props.tabArray !== undefined
    ) {
      this.state.objectArray = this.props.tabArray
      this.setState({})
    }
    if (
      this.props.dataName === 'Vendors' &&
      this.props.tabArray !== undefined
    ) {
      this.state.objectArray = this.props.tabArray
      this.setState({})
    }

    if (this.props.dataName === 'RecentlyViewed') {
      this.setState({
        spinnerTemp: true
      })
      this.getRecentlyViewed()
    }
  }

  getRecentlyViewed = () => {
    const json = this.props.recentViewedProducts
    this.getRecentData(json, true, true)
  }

  getData = (j, temp, re) => {
    this.state.objectArray = []
    this.state.objectArray = j
    if (this.mounted) {
      this.setState({
        isLoading: false,
        spinnerTemp: false,
        recent: re,
        loading: false,
        timeValue: 400
      })
    }
  }

  getRecentData = (j, temp, re) => {
    if (this.mounted) {
      this.setState({
        isLoading: false,
        spinnerTemp: false,
        recent: re,
        objectArray: j
      })
    }
  }

  newMethod2 (j, temp, recent) {
    this.getData(j, temp, recent)
  }

  render () {
    let { loading, timeValue } = this.state
    if (this.state.objectArray.length > 0 && loading === false) {
      loading = false
      timeValue = 1000
    } else {
      loading = true
      timeValue = 1000
    }

    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        listKey={(item, index) => `C${index.toString()}`}
        scrollEnabled={!this.props.scrollEnabled}
        contentContainerStyle={{
          marginLeft: 0,
          marginRight: 0,
          paddingBottom: 0,
          marginBottom: 0,
          paddingTop: 0,
          marginTop: 0,
          alignSelf: this.state.objectArray.length === 1 ? 'flex-start' : 'center'
        }}
        data={
          this.state.objectArray.length === 0
            ? ['', '', '']
            : this.state.objectArray
        }
        tabLabel={this.props.tabLabel}
        horizontal={this.props.vertical}
        numColumns={this.props.noOfCol}
        extraData={this.state}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          this.props.viewButton && this.props.dataName !== 'Flash' ? (
            <TouchableOpacity
              style={{
                paddingTop: 80,
                justifyContent: 'center',
                margin: 12,
                alignItems: 'center'
              }}
              onPress={() =>
                this.props.navigation.navigate('NewestScreen', {
                  id: this.props.parentId,
                  name: '',
                  brand:
                    this.props.dataName === 'topSelling'
                      ? 'topSelling'
                      : this.props.dataName === 'isFeatured'
                        ? 'isFeatured'
                        : 'discount_price'
                })
              }>
              <View
                style={{
                  alignItems: 'center',
                  height: 38,
                  width: 100,
                  justifyContent: 'center',
                  flexDirection: 'row'
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: this.props.themeStyle.primary,
                    fontSize: appTextStyle.smallSize,
                    fontFamily: appTextStyle.fontFamily
                  }}>
                  {this.props.language['View All']}
                </Text>
                <Icon
                  name={
                    !I18nManager.isRTL
                      ? 'chevron-right'
                      : 'chevron-left'
                  }
                  style={{
                    color: this.props.themeStyle.primary,
                    fontSize: 14,
                    paddingTop: 2,
                    paddingLeft: !I18nManager.isRTL ? 8 : 8,
                    paddingRight: I18nManager.isRTL ? 8 : 8
                  }}
                />
              </View>
            </TouchableOpacity>
          ) : null
        }
        renderItem={item =>
          <Loader
            secondaryColor='rgba(208, 205, 205, 1)'
            primaryColor='rgba(218, 215, 215, 1)'
            animationDuration={timeValue}
            active
            loading={loading}
            containerStyles={{
              backgroundColor: this.props.themeStyle.secondryBackgroundColor,
              height:
                  this.props.card_style === 12
                    ? themeStyle.singleRowCardWidth + 34
                    : this.props.card_style === 10 ||
                      this.props.card_style === 13 ||
                      this.props.card_style === 14 ||
                      this.props.card_style === 16 ||
                      this.props.card_style === 19 ||
                      this.props.card_style === 21 ||
                      this.props.card_style === 7
                      ? themeStyle.singleRowCardWidth + 43
                      : this.props.card_style === 4 ||
                      this.props.card_style === 9 ||
                      this.props.card_style === 5
                        ? themeStyle.singleRowCardWidth + 48
                        : this.props.cartButton ||
                      this.props.card_style === 3 ||
                      this.props.card_style === 8 ||
                      this.props.card_style === 15 ||
                      this.props.card_style === 17 ||
                      this.props.card_style === 18 ||
                      this.props.card_style === 22
                          ? themeStyle.singleRowCardWidth + 65
                          : this.props.card_style === 20
                            ? themeStyle.singleRowCardWidth + 48
                            : themeStyle.singleRowCardWidth + 37,
              width: this.props.vertical
                ? themeStyle.singleRowCardWidth
                : WIDTH * themeStyle.twoRowCardWIdth,
              shadowOffset: { width: 1, height: 1 },
              shadowColor: appTextStyle.textColor,
              shadowOpacity: 0.2,
              elevation: 2,
              margin: 5,
              borderRadius: appTextStyle.customRadius - 8
            }}
            pRows={2
            }
            pWidth={['100%', '100%', '80%']}
            pHeight={30}
            titleStyles={{
              height: 100,
              width: this.props.vertical
                ? themeStyle.singleRowCardWidth
                : WIDTH * themeStyle.twoRowCardWIdth,
              alignSelf: 'center',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 0,
              flex: 1,
              borderRadius: appTextStyle.customRadius - 8,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0

            }}
            paragraphStyles={{
              paddingTop: 6,
              padding: 6,
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center'
            }}>
            <CardTem
              objectArray={this.state.objectArray[item.index]}
              index={item.index}
              backgroundColor={colorFun(this, item.index)}
              dataName={this.props.dataName}
              rows={this.props.vertical}
              recent={this.state.recent}
              cardStyle={this.props.cardStyle}
              width={
                this.props.vertical
                  ? this.props.width
                  : WIDTH * themeStyle.twoRowCardWIdth
              }
            />
          </Loader>
        }
      />
    )
  }
}
const getLanguage = (state) => state.appConfig.languageJson
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)

const getTheme = (state) => state.appConfig.themeStyle
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)

const mapStateToProps = state => {
  return {
    themeStyle: getThemeFun(state),
    recentViewedProducts: [],
    card_style: 1,
    cartButton: true,
    language: getLanguageFun(state)
  }
}

export default connect(mapStateToProps, null)(FlatListView)
