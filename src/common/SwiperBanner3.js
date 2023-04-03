import React from 'react'
import { Animated, Dimensions, TouchableOpacity, View } from 'react-native'
import { ParallaxSwiper, ParallaxSwiperPage } from './index'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-easy-toast'
import { getUrl, postHttp } from '../common/WooComFetch'
import theme from './Theme.style'
import Image from 'react-native-scalable-image'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
const { width } = Dimensions.get('window')

class App extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      spinnerTemp: false
    }
  }

  myCustomAnimatedValue = new Animated.Value(0)

  getPageTransformStyle = index => ({
    transform: [
      {
        scale: this.myCustomAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + 8), // Add 8 for dividerWidth
            index * (width + 8),
            (index + 1) * (width + 8)
          ],
          outputRange: [0, 1, 0],
          extrapolate: 'clamp'
        }, { useNativeDriver: true })
      },
      {
        rotate: this.myCustomAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + 8),
            index * (width + 8),
            (index + 1) * (width + 8)
          ],
          outputRange: ['180deg', '0deg', '-180deg'],
          extrapolate: 'clamp'
        }, { useNativeDriver: true })
      }
    ]
  })

  // getting single product data
  getOneProduct = async value => {
    this.setState({ spinnerTemp: true })
    const formData = new FormData()
    formData.append('language_id', '1')
    formData.append('products_id', value)
    formData.append('currency_code', '1')
    formData.append(
      'currency_code',
      this.props.currency
    )
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

  render () {
    return (
      <View>
        <Spinner visible={this.state.spinnerTemp} />
        <Toast
          ref='toast'
          style={{
            backgroundColor: this.props.themeStyle.primaryBackgroundColor,
            position: 'absolute',
            top: -39,
            zIndex: 12
          }}
          position='top'
          positionValue={200}
          fadeOutDuration={1000}
          textStyle={{ color: '#fff', fontSize: 15 }}
        />

        <ParallaxSwiper
          speed={0.5}
          animatedValue={this.myCustomAnimatedValue}
          dividerWidth={8}
          dividerColor={this.props.themeStyle.textColor}
          backgroundColor={this.props.themeStyle.textColor}
          showProgressBar={true}
          progressBarBackgroundColor='rgba(0,0,0,0.25)'
          progressBarValueBackgroundColor={this.props.themeStyle.primaryBackgroundColor}
          progressBarThickness={4}>
          {this.props.banners.length > 0
            ? this.props.banners.map((val, key) => (
              <ParallaxSwiperPage
                scrollToIndex={0}
                BackgroundComponent={
                  <TouchableOpacity
                    onPress={() => {
                      if (val.type === 'category') {
                        this.props.navigation.navigate('NewestScreen', {
                          id: parseInt(val.url),
                          name: '',
                          sortOrder: val.type
                        })
                      } else if (val.type === 'product') {
                        this.getOneProduct(parseInt(val.url))
                      } else {
                        this.props.navigation.navigate('NewestScreen', {
                          id: parseInt(val.url),
                          name: '',
                          sortOrder: val.type
                        })
                      }
                    }}>
                    <Image
                      placeholder={false}
                      ActivityIndicator={true}
                      key={key}
                      width={Dimensions.get('window').width}
                      loadingStyle={{
                        size: 'large',
                        color: this.props.themeStyle.primary
                      }}
                      placeholderStyle={{ width: 0, height: 0 }}
                      source={{
                        uri:
                            val.image !== undefined
                              ? theme.url +
                                '/' +
                                val.image.toString().startsWith('https')
                                ? theme.url + '/' + val.image.toString()
                                : theme.url +
                                  '/' +
                                  val.image.toString().replace('http', 'https')
                              : ''
                      }}
                    />
                  </TouchableOpacity>
                }
              />
            ))
            : null}
        </ParallaxSwiper>
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
export default connect(mapStateToProps, null)(App)
