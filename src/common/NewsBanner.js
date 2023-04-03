import React, { PureComponent } from 'react'
import { View, Dimensions } from 'react-native'
import ImageLoad from './RnImagePlaceH'
import Swiper from '../common/Swiper'
import theme from './Theme.style'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
const { width } = Dimensions.get('window')
class Banner extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      newsBannerData: []
    }
  }

  static getDerivedStateFromProps (props) {
    if (props.newsBannerData.length !== 0) {
      return {
        newsBannerData: props.newsBannerData
      }
    }
    return null
  }

  render () {
    return this.state.isLoading && this.state.newsBannerData.length > 0 ? (
      <View>
        <Swiper
          navigation={this.props.navigation}
          type='Home'
          news={this.props.news}>
          {this.state.newsBannerData.map((val, key) => (
            <ImageLoad
              key={key}
              style={{ width, height: 200 }}
              loadingStyle={{ size: 'large', color: this.props.themeStyle.primary }}
              placeholderStyle={{ width: 0, height: 0 }}
              placeholder={false}
              ActivityIndicator={true}
              source={{
                uri:
                  val.news_image !== undefined
                    ? theme.url + '/' + val.news_image.toString()
                    : ''
              }}
            />
          ))}
        </Swiper>
      </View>
    ) : null
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
export default connect(mapStateToProps, null)(Banner)
