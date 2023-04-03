import React, { PureComponent } from 'react'
import { Dimensions, View, TouchableOpacity } from 'react-native'
import theme from './Theme.style'
import ImageLoad from './RnImagePlaceH'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-easy-toast'
import { getUrl, postHttp } from '../common/WooComFetch'
import { createSelector } from 'reselect'
import Carousel, { Pagination } from 'react-native-snap-carousel'
class MyCarousel extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      labels:
        this.props.banners.length > 0 ? this.props.banners : [],
      activeSlide: this.props.banners.length > 0 ? 0 : 0,
      loading: false,
      spinnerTemp: false
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (props.banners.length > 0) {
      return {
        labels: props.banners
      }
    } else {

    }
  }

  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.type === 'category') {
            this.props.navigation.navigate('NewestScreen', {
              id: parseInt(item.url),
              name: '',
              sortOrder: item.type
            })
          } else if (item.type === 'product') {
            this.getOneProduct(parseInt(item.url))
          } else {
            this.props.navigation.navigate('NewestScreen', {
              id: parseInt(item.url),
              name: '',
              sortOrder: item.type
            })
          }
        }}>
        <ImageLoad
          placeholder={false}
          ActivityIndicator={true}
          key={index}
          resizeMode={'contain'}
          style={{ width: width * 0.8, height: width * 0.6 }}
          loadingStyle={{
            size: 'large',
            color: this.props.themeStyle.primary
          }}
          placeholderStyle={{ width: 0, height: 0 }}
          source={{
            uri:
              item.image !== undefined
                ? theme.url + '/' + item.image.toString().startsWith('https')
                  ? theme.url + '/' + item.image.toString()
                  : theme.url +
                    '/' +
                    item.image.toString().replace('http', 'https')
                : ''
          }}
        />
      </TouchableOpacity>
    )
  }

  get pagination () {
    const { labels, activeSlide } = this.state
    return (
      <Pagination
        dotsLength={labels.length}
        activeDotIndex={activeSlide}
        dotStyle={{ height: 2 }}
        containerStyle={{
          backgroundColor: this.props.themeStyle.primaryBackgroundColor,
          paddingTop: 8,
          paddingBottom: 2
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 1,
          backgroundColor: this.props.themeStyle.primary
        }}
        inactiveDotStyle={{
          backgroundColor: 'rgba(0,0,0,0.2)'
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }

  // getting single product data
  getOneProduct = async value => {
    this.setState({ spinnerTemp: true })
    const formData = new FormData()
    formData.append('language_id', '1')
    formData.append('products_id', value)
    formData.append('currency_code', '1')
    const json2 = await postHttp(
      getUrl() + '/api/' + 'getallproducts',
      formData
    )
    if (json2.success !== '1') {
      this.setState({ spinnerTemp: false })
      this.refs.toast.show(
        json2.message)
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
            backgroundColor: this.props.themeStyle.primary,
            position: 'absolute',
            top: -39,
            zIndex: 12
          }}
          position='top'
          positionValue={200}
          fadeOutDuration={1000}
          textStyle={{ color: '#fff', fontSize: 15 }}
        />
        <Carousel
          ref={c => {
            this._carousel = c
          }}
          loop={theme.autoplayLoop}
          autoplay={theme.autoplay}
          autoplayDelay={theme.autoplayDelay * 1000}
          autoplayInterval={3000}
          layout={'default'}
          data={this.state.labels}
          firstItem={this.props.banners.length > 0 ? 0 : 0}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          onSnapToItem={index => this.setState({ activeSlide: index })}
        />
        {this.pagination}
      </View>
    )
  }
}
export const { width, height } = Dimensions.get('window')
const horizontalMargin = 20
const slideWidth = Dimensions.get('window').width * 0.6789
const sliderWidth = Dimensions.get('window').width
const itemWidth = slideWidth + horizontalMargin * 2

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
/// //////////////////////////////////////////
export default connect(mapStateToProps, null)(MyCarousel)
