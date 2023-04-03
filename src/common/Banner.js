import React, { PureComponent } from 'react'
import {
  Dimensions, StyleSheet, View, TouchableOpacity, Image
} from 'react-native'
import Loader from 'react-native-easy-content-loader'
import { createSelector } from 'reselect'
import { getLargeImage, getUrl, postHttp } from '../common/WooComFetch'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-easy-toast'
import theme, { appTextStyle } from './Theme.style'
import SwiperFlatList from 'react-native-swiper-flatlist'

const WIDTH = Dimensions.get('window').width
class SwiperBanner extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      loading: false,
      spinnerTemp: false
    }
  }

  async getOneProduct (value) {
    this.setState({ spinnerTemp: true })
    const formData = new FormData()
    formData.append('language_id', '1')
    formData.append('products_id', value)
    const json2 = await postHttp(
      getUrl() + '/api/' + 'getallproducts',
      formData
    )
    if (json2.success !== '1') {
      this.setState({ spinnerTemp: false })
      this.refs.toast.show(
        json2.message +
        this.props.language
      )
    } else {
      this.setState({ spinnerTemp: false })
      this.props.navigation.navigate('ProductDetails', {
        objectArray: json2.product_data[0] //
      })
    }
    this.setState({ spinnerTemp: false })
  }

  onClickFun = (val) => {
    if (val.banner_navigation.id === 1) {
      this.props.navigation.navigate('Category', {
      })
    } else if (val.banner_navigation.id === 2) {
      this.props.navigation.navigate('ProductDetails', {
        objectArray: Object.create({
          product_id: val.banner_navigation.id
        })
      })
    }
  }

  bannersRender (imagestyle) {
    return this.props.banners.length > 0
      ? this.props.banners.map((val, key) => (
        <TouchableOpacity
          key={key}
          onPress={this.onClickFun.bind(this, val)}>
          <Image
            placeholder={false}
            key={key}
            style={imagestyle}
            resizeMode={'cover'}
            source={{
              uri:
                val.gallary !== undefined
                  ? getLargeImage() + val.gallary.toString().startsWith('https')
                    ? getLargeImage() + val.gallary.toString()
                    : getLargeImage() +
                    val.gallary.toString().replace('http', 'https')
                  : ''
            }}
          />
        </TouchableOpacity>
      ))
      : null
  }

  render () {
    let { loading } = this.state
    if (this.props.banners !== undefined) {
      if (this.props.banners.length > 0) {
        loading = false
      } else {
        loading = true
      }
    }
    return this.props.banners !== undefined ? (
      <View style={{ marginTop: 10 }}>
        <Spinner visible={this.state.spinnerTemp} />
        <Toast
          ref='toast'
          style={{ backgroundColor: this.props.themeStyle.secondry }}
          position='top'
          positionValue={200}
          fadeOutDuration={1000}
          textStyle={{ color: '#fff', fontSize: 15 }}
        />
        <Loader
          active
          secondaryColor='rgba(208, 205, 205, 1)'
          primaryColor='rgba(218, 215, 215, 1)'
          animationDuration={400}
          loading={loading}
          pRows={0}
          titleStyles={styles.loaderTitleStyle}>
          <View>
            {this.props.settings.banner_style === '1' ? (
              <View style={[styles.container, {
                margin: 0,
                height: Dimensions.get('window').height * 0.25,
                flex: 1
              }]}>
                <SwiperFlatList
                  autoplay={theme.autoplay}
                  autoplayDelay={theme.autoplayDelay}
                  autoplayLoop={theme.autoplayLoop}
                  index={0}
                  showPagination
                  paginationDefaultColor={'rgba(0,0,0,0.2)'}
                  paginationActiveColor={this.props.themeStyle.primaryBackground}
                  paginationStyleItem={styles.bannerOnePagination}>
                  {this.bannersRender([styles.imageStyle, {
                    height: Dimensions.get('window').height * 0.25,
                    borderRadius: appTextStyle.customRadius - 4
                  }])}
                </SwiperFlatList>
              </View>
            ) : null}
            {this.props.settings.banner_style === '2' ? (
              <View style={[styles.container, { height: Dimensions.get('window').height * 0.25, flex: 1 }]}>
                <SwiperFlatList
                  autoplay={theme.autoplay}
                  autoplayDelay={theme.autoplayDelay}
                  autoplayLoop={theme.autoplayLoop}
                  index={0}
                  showPagination
                  paginationDefaultColor={'rgba(0,0,0,0.2)'}
                  paginationActiveColor={this.props.themeStyle.primaryBackground}
                  paginationStyleItem={styles.bannerTwoPagination}>
                  {this.bannersRender([styles.imageStyle, {
                    height: Dimensions.get('window').height * 0.25,
                    borderRadius: appTextStyle.customRadius - 4
                  }])}
                </SwiperFlatList>
              </View>
            ) : null}
            {/* ///////////////////////////////////// */}
            {this.props.settings.banner_style === '3' ? (
              <View style={[styles.container, {
                height: Dimensions.get('window').height * 0.25,
                width: WIDTH,
                flex: 1
              }]}>
                <SwiperFlatList
                  autoplay={theme.autoplay}
                  autoplayDelay={theme.autoplayDelay}
                  autoplayLoop={theme.autoplayLoop}
                  index={0}
                  showPagination
                  paginationDefaultColor={'rgba(0,0,0,0.2)'}
                  paginationActiveColor={this.props.themeStyle.primaryBackground}
                  paginationStyleItem={styles.bannerTwoPagination}>
                  {this.bannersRender([styles.imageStyle, {
                    height: Dimensions.get('window').height * 0.25,
                    borderRadius: appTextStyle.customRadius - 4,
                    width: WIDTH
                  }])}
                </SwiperFlatList>
              </View>
            ) : null}
            {this.props.settings.banner_style === '4' ? (
              <View style={[styles.container, {
                height: Dimensions.get('window').height * 0.25,
                flex: 1
              }]}>
                <SwiperFlatList
                  autoplay={theme.autoplay}
                  autoplayDelay={theme.autoplayDelay}
                  autoplayLoop={theme.autoplayLoop}
                  paginationActiveColor={this.props.themeStyle.primaryBackground}
                  paginationDefaultColor={'rgba(0,0,0,0.2)'}
                  index={0}
                  showPagination
                  paginationStyleItem={styles.bannerFourPaginationItem}
                  paginationStyle={styles.bannerFourPagination}>
                  {this.bannersRender([styles.imageStyle, {
                    height: Dimensions.get('window').height * 0.25
                  }])}
                </SwiperFlatList>
              </View>
            ) : null}
          </View>
        </Loader>
      </View>
    ) : (
      <View></View>
    )
  }
}
const getLanguage = (state) => state.appConfig.languageJson['No Products Found']
const getBanners = (state) => state.bannersData.banners
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
const getBannersFun = createSelector(
  [getBanners],
  (getBanners) => {
    return getBanners
  }
)
const getTheme = (state) => state.appConfig.themeStyle
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const getSettings = (state) => state.settingsCall.settings
const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
  }
)

const mapStateToProps = state => {
  return {
    themeStyle: getThemeFun(state),
    banners: getBannersFun(state),
    language: getLanguageFun(state),
    settings: getSettingsFun(state)
  }
}

export default connect(mapStateToProps, null)(SwiperBanner)

export const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height * 0.23,
    width: WIDTH * 0.921,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  imageStyle: {
    height: Dimensions.get('window').height * 0.23,
    width: WIDTH * 0.92,
    borderRadius: appTextStyle.customRadius - 7
  },
  loaderTitleStyle: {
    height: 190,
    width: WIDTH * 0.94,
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  bannerOnePagination: {
    width: 8,
    height: 8,
    marginLeft: 3,
    marginRight: 3,
    marginBottom: -5
  },
  bannerTwoPagination: {
    width: 15,
    borderRadius: 5 / 2,
    height: 7,
    marginLeft: 3,
    marginRight: 3,
    marginBottom: -5
  },
  bannerThreePaginationItem: {
    width: 8,
    height: 8,
    margin: 1,
    marginLeft: 3,
    marginRight: 3
  },
  bannerThreePagination: { flexDirection: 'row', marginBottom: -20 },
  bannerFourPaginationItem: { width: 6, height: 15, margin: 2 },
  bannerFourPagination: {
    flexDirection: 'column-reverse',
    width: 15,
    right: 5,
    top: 22
  }
})
