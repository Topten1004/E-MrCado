import React, { PureComponent } from 'react'
import {
  View,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  I18nManager
} from 'react-native'
import { createSelector } from 'reselect'
import { UIActivityIndicator } from 'react-native-indicators'
import VideoPlayer from 'react-native-video-player'
import Swiper from '../common/Swiper'
import { connect } from 'react-redux'
import ImageLoad from './RnImagePlaceH'
import { Icon } from 'native-base'
import ImageViewer from 'react-native-image-zoom-viewer'
import { getLargeImage } from './WooComFetch'
import { appTextStyle } from './Theme.style'
const { width } = Dimensions.get('window')
class Banner extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      isLoading: true,
      page: 11,
      refreshing: false,
      loading: true,
      visible: false,
      index: 0
    }
  }

  static getDerivedStateFromProps (props, state) {
    state.dataSource = []
    let temp = 1
    if (props.objectArray.product_video_url !== null) {
      state.dataSource.push(
        Object.create({
          url: props.objectArray.product_video_url,
          id: 0
        })
      )
    }
    if (typeof props.productImage !== 'string') {
      props.productImage.map(val2 => {
        state.dataSource.push(
          Object.create({
            url: getLargeImage() + val2.gallary_name,

            id: temp
          })
        )
        temp++
      })
    } else {
      state.dataSource.push(
        Object.create({
          url: getLargeImage() + val2.gallary_name,
          id: 1
        })
      )
    }
    return null
  }

  componentDidMount () {
    this.state.dataSource = []
    let temp2 = 0
    this.props.productImage.map(val2 => {
      this.state.dataSource.push(
        Object.create({
          url: getLargeImage() + val2.gallary_name,
          id: temp2
        })
      )
      temp2++
    })

    this.setState({
      isLoading: false
    })
  }

  render () {
    return this.state.isLoading ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          height: 200
        }}>
        <UIActivityIndicator size={27} color={this.props.themeStyle.primary} />
      </View>
    ) : (
      <Swiper
        navigation={this.props.navigation}
        type='Home'
        type2='ProductDetails'>
        {this.state.dataSource.map((val, key) => (
          <TouchableWithoutFeedback
            key={key}
            onPress={() => {
              this.setState({ visible: true, index: key })
            }}>
            <View>
              <Modal onRequestClose={() => {
                this.setState({
                  visible: false
                })
              }} visible={this.state.visible} transparent>
                <ImageViewer
                  index={this.state.index}
                  imageUrls={this.state.dataSource}
                  enableSwipeDown
                  onSwipeDown={() => this.setState({ visible: false })}
                  renderHeader={() => (
                    <TouchableWithoutFeedback
                      style={{
                        height: 200,
                        width: width * 0.935,
                        borderRadius: appTextStyle.customRadius,
                        backgroundColor: 'red',
                        overflow: 'visible',
                        paddingLeft: 80,
                        zIndex: 63
                      }}
                      onPress={() => this.setState({ visible: false })}>
                      <Icon
                        onPress={() => this.setState({ visible: false })}
                        name={'close'}
                        style={{
                          fontSize: 22,
                          color: '#fff',
                          width: width * 0.935,
                          borderRadius: appTextStyle.customRadius,

                          height: 100,
                          left: 0,
                          right: 0,
                          paddingLeft: !I18nManager.isRTL ? 20 : 20,
                          paddingRight: !I18nManager.isRTL ? 2 : 20,
                          paddingTop: !I18nManager.isRTL
                            ? Platform.OS === 'ios'
                              ? 70
                              : 70
                            : 70,
                          zIndex: 63,
                          position: 'absolute',
                          top: 0,
                          overflow: 'visible',
                          backgroundColor: 'transparent'
                        }}
                      />
                    </TouchableWithoutFeedback>
                  )}
                />
              </Modal>
              {val.id === 0
                ? <View style={{
                  width: width * 0.935,
                  borderRadius: appTextStyle.customRadius
                }}>
                  <VideoPlayer
                    // video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                    video={{ uri: val.url }}
                    style={{ borderRadius: appTextStyle.customRadius }}
                    videoWidth={1600}
                    videoHeight={1530}
                    thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
                  />
                </View>
                : <ImageLoad
                  resizeMode={'cover'}
                  key={key}
                  style={{
                    width: width * 0.935,
                    borderRadius: appTextStyle.customRadius,

                    backgroundColor: 'rgb(236, 236, 236)',
                    height: 370
                  }}
                  loadingStyle={{
                    size: 'large',
                    color: this.props.themeStyle.primary
                  }}
                  placeholder={false}
                  ActivityIndicator={true}
                  placeholderStyle={{ width: 0, height: 0 }}
                  source={{ uri: val.url }}
                />
              }
            </View>
          </TouchableWithoutFeedback>
        ))}
      </Swiper>
    )
  }
}

/// ///////////////////////////////////////////////
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
export default connect(mapStateToProps, null)(Banner)
