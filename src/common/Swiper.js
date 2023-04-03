import React, { PureComponent } from 'react'
import {
  Dimensions, // Detects screen dimensions
  Platform, // Detects platform running the app
  ScrollView, // Handles navigation between screens
  StyleSheet, // CSS-like styles
  View, // Container PureComponent,
  I18nManager,
  TouchableOpacity,
  Text,
  StatusBar,
  PixelRatio
} from 'react-native'
import { introShowFun } from '../redux/actions/actions'
import { appTextStyle } from './Theme.style'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

const { width, height } = Dimensions.get('window')
let condition = 1
class OnboardingScreens extends PureComponent {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#16a085',
      elevation: null
    }
  }

  condition = 1
  // Props for ScrollView component
  static defaultProps = {
    // Arrange screens horizontally
    horizontal: true,
    // Scroll exactly to the next screen, instead of continous scrolling
    pagingEnabled: true,
    // Hide all scroll indicators
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    // Do not bounce when the end is reached
    bounces: false,
    // Do not scroll to top when the status bar is tapped
    scrollsToTop: false,
    // Remove offscreen child views
    removeClippedSubviews: true,
    // Do not adjust content behind nav-, tab- or toolbars automatically
    automaticallyAdjustContentInsets: false,
    // Fisrt is screen is active
    index: 0
  }

  state = this.initState(this.props)
  /**
   * Initialize the state
   */
  initState (props) {
    // Get the total number of slides passed as children

    const total = props.children ? props.children.length || 1 : 0
    // Current index
    const index =
      this.props.type === 'Home'
        ? total > 1
          ? 0
          : 0
        : total > 1
          ? Math.min(props.index, total - 1)
          : 0
    const offset = width * (index - 1)

    const state = {
      total,
      index,
      offset,
      width,
      height,
      timer: null,
      temp: -1
    }

    // Component internals as a class property,
    // and not state to avoid component re-renders when updated
    this.internals = {
      isScrolling: false,
      offset
    }

    return state
  }

  /**
   * Scroll begin handler
   * @param {object} e native event
   */
  onScrollBegin = () => {
    // Update internal isScrolling state
    this.internals.isScrolling = true
  }

  /**
   * Scroll end handler
   * @param {object} e native event
   */
  onScrollEnd = e => {
    // Update internal isScrolling state
    this.internals.isScrolling = false

    // Update index
    this.updateIndex(
      e.nativeEvent.contentOffset
        ? e.nativeEvent.contentOffset.x
        : e.nativeEvent.position * this.state.width
    )
  }

  /*
   * Drag end handler
   * @param {object} e native event
   */
  onScrollEndDrag = e => {
    const {
      contentOffset: { x: newOffset }
    } = e.nativeEvent
    const { children } = this.props
    const { index } = this.state
    const { offset } = this.internals

    // Update internal isScrolling state
    // if swiped right on the last slide
    // or left on the first one
    if (
      offset === newOffset &&
      (index - 1 === 0 || index - 1 === children.length - 1)
    ) {
      this.internals.isScrolling = false
    }
  }

  /**
   * Update index after scroll
   * @param {object} offset content offset
   */
  updateIndex = offset => {
    const state = this.state
    const diff = offset - this.internals.offset
    const step = state.width
    let index = state.temp
    // Do nothing if offset didn't change
    if (!diff) {
      return
    }

    // Make sure index is always an integer
    index = parseInt(index + Math.round(diff / step), 10)
    // Update internal offset
    this.internals.offset = offset
    // Update index in the state
    this.setState({
      temp: index,
      index
    })
  }

  /**
   * Swipe one slide forward
   */
  swipe = () => {
    // Ignore if already scrolling or if there is less than 2 slides
    if (this.internals.isScrolling || this.state.total < 2) {
      return
    }

    const state = this.state
    const diff = this.state.index + 1
    const x = diff * state.width
    const y = 0

    // Call scrollTo on scrollView component to perform the swipe
    this.scrollView && this.scrollView.scrollTo({ x, y, animated: true, useNativeDriver: true })

    // Update internal scroll state
    this.internals.isScrolling = true

    // Trigger onScrollEnd manually on android
    if (Platform.OS === 'android') {
      setImmediate(() => {
        this.onScrollEnd({
          nativeEvent: {
            position: diff
          }
        })
      })
    }
  }

  /**
   * Render ScrollView component
   * @param {array} slides to swipe through
   */
  renderScrollView = pages => (
    <ScrollView
      ref={component => {
        this.scrollView = component
      }}
      {...this.props}
      contentContainerStyle={[styles.wrapper, this.props.style]}
      onScrollBeginDrag={this.onScrollBegin}
      onMomentumScrollEnd={this.onScrollEnd}
      onScrollEndDrag={this.onScrollEndDrag}>
      {pages.map((page, i) => (
        // Render each slide inside a View
        <View style={styles.slide} key={i}>
          {page}
        </View>
      ))}
    </ScrollView>
  )

  componentDidMount () {
    condition = 1
  }

  /**
   * Render pagination indicators
   */
  renderPagination = () => {
    if (this.state.total <= 1) {
      return null
    }

    const ActiveDot = (
      <View
        style={
          this.props.type === 'Home'
            ? [styles.dotHome, {
              backgroundColor: this.props.themeStyle.primary
            }]
            : [styles.dot, {
              backgroundColor: this.props.themeStyle.primary
            }]
        }
      />
    )
    const Dot = (
      <View
        style={this.props.type === 'Home' ? styles.dotHome : styles.dot}
      />
    )
    // let temp =0;
    const dots = []
    for (let key = 0; key < this.state.total; key++) {
      dots.push(
        key <= this.state.index
          ? React.cloneElement(ActiveDot, { key })
          : React.cloneElement(Dot, { key })
      )
    }
    if (this.props.type === 'Home') {
      if (this.state.index !== 0) {
        condition = 0
      }
      return (
        <View
          pointerEvents='none'
          style={{
            flexDirection:
              condition === 1 && this.state.total - 1 !== this.state.index
                ? 'row'
                : Platform.OS === 'android'
                  ? I18nManager.isRTL
                    ? 'row-reverse'
                    : 'row'
                  : 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            flex: 1,
            backgroundColor: this.props.themeStyle.textColor
          }}>
          {dots}
        </View>
      )
    }

    return (
      <View
        pointerEvents='none'
        style={[styles.pagination, styles.fullScreen2]}>
        {dots}
      </View>
    )
  }

  FUN = nav => {
    StatusBar.setBackgroundColor(this.props.themeStyle.StatusBarColor)
    StatusBar.setHidden(false)
    this.props.introShowFun(false)
    nav.navigate('App')
    // nav.navigate('LoginStack')
  }

  /**
   * Render Continue or Done button
   */
  renderButton = nav => {
    // this.state = this.initState(this.props);
    const lastScreen = this.state.index === this.state.total - 1
    if (lastScreen) {
      this.state = this.initState(this.props)
      // this.setState({index:0})
    }
    return (
      <View
        pointerEvents='box-none'
        style={[styles.buttonWrapper]}>
        {this.props.type === 'Home' ? null : lastScreen ? (
          <TouchableOpacity
            style={{ paddingTop: 5 }}
            onPress={() => {
              this.FUN(nav)
            }}>
            <View
              style={{
                alignItems: 'center',
                height: '46%',
                width: '80%',
                justifyContent: 'center',
                backgroundColor: this.props.themeStyle.primary,
                borderRadius: appTextStyle.customRadius - 4
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: this.props.themeStyle.textTintColor,
                  fontSize: appTextStyle.largeSize + PixelRatio.getPixelSizeForLayoutSize(1),
                  fontWeight: 'bold',
                  fontFamily: appTextStyle.fontFamily
                }}>
                {'Home'}
                {/* {this.props.language.SignIn} */}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ paddingTop: 5 }}
            onPress={() => this.swipe(nav)}>
            <View
              style={{
                alignItems: 'center',
                height: '46%',
                width: '80%',
                justifyContent: 'center',
                backgroundColor: this.props.themeStyle.primary,
                borderRadius: appTextStyle.customRadius - 4
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: this.props.themeStyle.textTintColor,
                  fontSize: appTextStyle.largeSize + PixelRatio.getPixelSizeForLayoutSize(1),
                  fontWeight: 'bold',
                  fontFamily: appTextStyle.fontFamily
                }}>
                {'Next'}
                {/* {this.props.language.Next} */}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {this.props.type !== 'Home'
          ? <TouchableOpacity
            style={{ marginTop: '-16%' }}
            onPress={() => {
              this.props.introShowFun(false)
              nav.navigate('App')
            }}>
            <View
              style={{
                alignItems: 'center',
                // height: '48%',
                width: '30%',
                left: '25%',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                borderRadius: appTextStyle.customRadius - 11

              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#000000',
                  fontSize: appTextStyle.mediumSize + PixelRatio.getPixelSizeForLayoutSize(1) - 2,
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                  fontFamily: appTextStyle.fontFamily
                }}>
                {'Skip'}
                {/* {this.props.type === 'Home' ? null : lastScreen ? 'Home' : 'Skip'} */}
                {/* {this.props.type === 'Home' ? null : lastScreen ? this.props.language.Home : this.props.language.Skip} */}
              </Text>
            </View>
          </TouchableOpacity>
          : null}
      </View>
    )
  }

  /**
   * Render the component
   */

  render = ({ children } = this.props) => (
    <View>
      {
        <View>
          {this.props.type === 'Home' &&
            this.props.type2 !== 'ProductDetails' ? (
              <View
                style={[
                  styles.container,
                  {
                    width,
                    height: 200,
                    backgroundColor: 'transparent'
                  }
                ]}>
                {/* Render screens */}
                {this.renderScrollView(children)}
                {/* Render pagination */}
                {this.renderPagination()}
                {/* Render Continue or Done button */}
                {this.renderButton(this.props.navigation)}
              </View>
            ) : this.props.type2 === 'ProductDetails' ? (
              <View style={[styles.container, styles.fullScreen3]}>
                {/* Render screens */}
                {this.renderScrollView(children)}
                {/* Render pagination */}
                {this.renderPagination()}
                {/* Render Continue or Done button */}
                {this.renderButton(this.props.navigation)}
              </View>
            ) : (
            // IntroScreen
              <View style={[styles.container, styles.fullScreen2]}>
                {/* Render screens */}
                {this.renderScrollView(children)}
                {/* Render pagination */}
                {this.renderPagination()}
                {/* Render Continue or Done button */}
                {this.renderButton(this.props.navigation)}
              </View>
            )}
        </View>
      }
    </View>
  )
}

/// ///////////////////////////////////////////////
const getTheme = (state) => state.appConfig.themeStyle
const getLanguage = (state) => state.appConfig.languageJson

const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)

const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state)
})

const mapDispatchToProps = dispatch => ({
  introShowFun: (id) => dispatch(introShowFun(id))
})
export default connect(mapStateToProps, mapDispatchToProps)(OnboardingScreens)

const styles = StyleSheet.create({
  // Set width and height to the screen size
  fullScreen2: {
    width: '100%',
    height: '100%'
  },
  fullScreen3: {
    width: width * 0.935,
    height: 382,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    paddingTop: 12,
    borderRadius: appTextStyle.customRadius
  },
  // Main container
  container: {
    backgroundColor: 'transparent',
    position: 'relative'
  },
  // Slide
  slide: {
    backgroundColor: 'transparent'
  },
  // Pagination indicators
  pagination: {
    position: 'absolute',
    bottom: '26%',
    left: 0,
    right: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent'
  },
  paginationHome: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  // Pagination dot
  dotHome: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
    // marginTop: 0,
    bottom: 12
  },
  // Pagination dot
  dot: {
    backgroundColor: 'gray',
    width: 110,
    height: 6,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3
  },
  // Active dot
  activeDot: {
    // backgroundColor: themeStyle.otherBtnsColor
  },
  buttonWrapper: {
    position: 'absolute',
    zIndex: 1,
    height: '23%',
    width: '55%',
    right: '16%',
    bottom: '-8%'
  }
})
