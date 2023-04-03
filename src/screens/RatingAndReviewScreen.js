import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  Dimensions,
  Platform,
  TouchableOpacity,
  I18nManager,
  ScrollView,
  RefreshControl
} from 'react-native'
import * as Progress from 'react-native-progress'
import { createSelector } from 'reselect'
import { UIActivityIndicator } from 'react-native-indicators'
import { CardStyleInterpolators } from 'react-navigation-stack'
import Stars from 'react-native-stars'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-easy-toast'
import { Icon } from 'native-base'
import Dialog, { DialogContent, DialogTitle } from 'react-native-popup-dialog'
import { connect } from 'react-redux'
import { getUrl, getHttp, postHttp } from '../common/WooComFetch'
import ImageLoad from '../common/RnImagePlaceH'
import { appTextStyle } from '../common/Theme.style'
const Width2 = Dimensions.get('window').width
class RatingScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      drawerLockMode: 'locked-closed',
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
    this.getProductReviews()
    this.props.navigation.setParams({
      headerTitle: this.props.isLoading.appConfig.languageJson.Reviews,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  /// /////////////////
  constructor (props) {
    super(props)
    this.state = {
      reviews: [],
      visible: false,
      id: this.props.navigation.state.params.id,
      average: 0,
      activityIndicatorTemp: false,
      name: '',
      email: '',
      description: '',
      nonce: '',
      rating: 1,
      spinnerTemp: true,
      isRefreshing: false,
      r1: 0,
      r2: 0,
      r3: 0,
      r4: 0,
      r5: 0
    }
    this.toast = null
  }

  //= ==============================================================================================================================
  // <!-- 2.0 updates -->
  getProductReviews = async () => {
    let url = 'review'
    url += '?limit=' + 10
    url += '&product_id=' + this.state.id
    url += '&language_id=' + this.props.settings.language_id
    url += '&customer=1'
    url += '&currency=' + this.props.settings.currency_id

    const json = await getHttp(
      getUrl() +
      url
    )
    this.state.reviews = []
    if (json.data.data.length !== 0) {
      for (const value of json.data.data) { this.state.reviews.push(value) }
    }
    this.setState({
      activityIndicatorTemp: false,
      spinnerTemp: false,
      isRefreshing: false
    }, () => {
      this.calculateAll()
    })
  }

  //
  calculateAll = () => {
    let total2 = 0
    for (const value of this.state.reviews) {
      total2 = total2 + value.rating
    }
    if (this.state.reviews.length === 0) {
      this.setState({
        average: 0
      })
    } else {
      this.setState({
        average: (total2 / this.state.reviews.length)
      })
    }
    let r1 = 0; let r2 = 0; let r3 = 0; let r4 = 0; let r5 = 0
    const total = this.state.reviews.length
    for (const value2 of this.state.reviews) {
      if (value2.rating === '1') r1++
      if (value2.rating === '2') r2++
      if (value2.rating === '3') r3++
      if (value2.rating === '4') r4++
      if (value2.rating === '5') r5++
    }
    if (r1 === 0) {
      this.setState({
        r1: 0
      })
    } else {
      this.setState({
        r1: (100 / total) * r1
      })
    }
    if (r2 === 0) {
      this.setState({
        r2: 0
      })
    } else {
      this.setState({
        r2: (100 / total) * r2
      })
    }
    if (r3 === 0) {
      this.setState({
        r3: 0
      })
    } else {
      this.setState({
        r3: (100 / total) * r3
      })
    }
    if (r4 === 0) {
      this.setState({
        r4: 0
      })
    } else {
      this.setState({
        r4: (100 / total) * r4
      })
    }
    if (r5 === 0) {
      this.setState({
        r5: 0
      })
    } else {
      this.setState({
        r5: (100 / total) * r5
      })
    }
  }

  //
  avrgRatingView = (constValue, avg) => (
    <View style={styles.avgRatingView}>
      <Text
        style={[styles.avgConstValueTextm, {
          fontSize: appTextStyle.largeSize + 5,
          fontFamily: appTextStyle.fontFamily,
          color: this.props.themeStyle.textColor
        }]}>{`${constValue}`}</Text>

      <Stars
        disabled
        default={parseFloat(
          1
        )}
        count={1}
        starSize={50}
        half
        fullStar={<Icon name={'star'} style={[styles.myStarStyle, {
          fontSize: appTextStyle.largeSize + 5,
          color: this.props.themeStyle.textColor
        }]} />}
        emptyStar={
          <Icon
            name={'star-outline'}
            style={[styles.myStarStyle, styles.myEmptyStarStyle, {
              fontSize: appTextStyle.largeSize + 5,
              color: this.props.themeStyle.textColor
            }]}
          />
        }
        halfStar={<Icon name={'star-half'} style={[styles.myStarStyle, {
          fontSize: appTextStyle.largeSize + 5,
          color: this.props.themeStyle.textColor
        }]} />}
      />
      <View style={styles.progressBarView}>
        <Progress.Bar borderColor={this.props.themeStyle.primary}
          color={this.props.themeStyle.primary}
          progress={Number(avg)} width={Width2 * 0.4} height={8} />
      </View>

    </View>
  )

  /// /////////////////////////////////
  addComment = async () => {
    var dat = {}
    dat.product_id = this.state.id
    dat.rating = this.state.rating
    dat.languages_id = this.props.settings.language_id
    dat.title = this.state.description

    const json = await postHttp(getUrl() + 'review', dat)
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        this.toast.show('Thanks for Review!')
        this.getProductReviews()
      } else {
        this.toast.show(json.data.message)
        this.setState({
          spinnerTemp: false
        })
      }
    } else {
      this.toast.show(json.data.data.message)
      this.setState({
        spinnerTemp: false
      })
    }

    this.setState({
      spinnerTemp: false,
      name: '',
      email: '',
      description: '',
      rating: 1
    })
  }

  onRefreshTemp () {
    this.setState({ isRefreshing: true, page: 1 }, () => {
      this.getProductReviews()
    })
  }

  renderSeparator = () => (
    <View style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
  )

  canBeSubmitted () {
    const { rating, description } = this.state
    return rating > 0 && description.length > 0
  }

  render () {
    const isEnabled = this.canBeSubmitted()
    return this.state.activityIndicatorTemp ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: this.props.themeStyle.secondryBackgroundColor
        }}>
        <UIActivityIndicator
          size={27}
          color={this.props.themeStyle.primary}
        />
        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
          position='top'
          positionValue={400}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
        />
      </View>
    ) : (
      <View style={{ flex: 1 }}>
        <Toast
          ref={ref => { this.toast = ref }}
          style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
          position='bottom'
          positionValue={300}
          fadeOutDuration={7000}
          textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefreshTemp.bind(this)}
            />
          }
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: this.props.themeStyle.secondryBackgroundColor }}>

          <View style={[styles.innerContainer, {
            backgroundColor: this.props.themeStyle.secondryBackgroundColor
          }]}>
            <Spinner
              visible={this.state.spinnerTemp}
              textStyle={styles.spinnerTextStyle}
            />

            <View style={styles.headerContainer}>

              <View>

                <View style={styles.firsyHalfRatingView}>

                  <Text
                    style={{
                      fontSize: appTextStyle.largeSize + 18,
                      color: this.props.themeStyle.textColor,
                      fontFamily: appTextStyle.fontFamily,
                      paddingHorizontal: 10,
                      paddingTop: 3
                    }}>{`${this.state.average.toFixed(Number(this.props.settings.currency_decimals))}`}</Text>
                  <Stars
                    disabled
                    default={parseFloat(
                      1
                    )}
                    count={1}
                    starSize={50}
                    half
                    fullStar={<Icon name={'star'} style={[styles.myStarStyle, {
                      color: this.props.themeStyle.textColor
                    }]} />}
                    emptyStar={
                      <Icon
                        name={'star-outline'}
                        style={[styles.myStarStyle, styles.myEmptyStarStyle, {
                          color: this.props.themeStyle.textColor
                        }]}
                      />
                    }
                    halfStar={<Icon name={'star-half'} style={[styles.myStarStyle, {
                      color: this.props.themeStyle.textColor
                    }]} />}
                  />

                </View>

                <View
                  style={[styles.ratingView, {
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}>
                  <Text
                    style={[styles.totalRatingText, {
                      fontFamily: appTextStyle.fontFamily,
                      color: this.props.themeStyle.textColor
                    }]}>
                    {`${`${this.state.reviews.length} ${this.props.isLoading.appConfig.languageJson.rating}`} `}
                  </Text>
                </View>

              </View>

              <View style={{
                borderLeftWidth: 1,
                borderColor: this.props.themeStyle.iconPrimaryColor,
                paddingLeft: 9
              }}>
                {this.avrgRatingView(5, this.state.r5.toFixed())}
                {this.avrgRatingView(4, this.state.r4.toFixed())}
                {this.avrgRatingView(3, this.state.r3.toFixed())}
                {this.avrgRatingView(2, this.state.r2.toFixed())}
                {this.avrgRatingView(1, this.state.r1.toFixed())}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({ visible: true })
              }}
              style={[styles.btnView, {
                backgroundColor: this.props.themeStyle.primary
              }]}
            >
              <Text style={{
                color: this.props.themeStyle.textTintColor,
                fontFamily: appTextStyle.fontFamily,
                fontSize: appTextStyle.largeSize,
                padding: 8
              }}>
                {this.props.isLoading.appConfig.languageJson['Rate and write a review']}
              </Text>
            </TouchableOpacity>

            <FlatList
              data={
                this.state.reviews !== undefined &&
                this.state.reviews !== null &&
                this.state.reviews.toString() !== 'NaN'
                  ? this.state.reviews
                  : []
              }
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 20 }}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this.renderSeparator}
              extraData={this.state}
              renderItem={item => (
                <View style={[styles.cardView, {
                  backgroundColor: this.props.themeStyle.primaryBackgroundColor
                }]}>
                  <ImageLoad
                    key={item.index}
                    style={styles.imageView}
                    backgroundColor='transparent'
                    color='transparent'
                    source={require('../images/avatar.png')}
                  />

                  <View
                    style={styles.cardInnerView}>

                    <View style={styles.innerRowView}>

                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontFamily: appTextStyle.fontFamily,
                          color: this.props.themeStyle.textColor,
                          fontSize: appTextStyle.largeSize,
                          paddingLeft: 1
                        }}>
                        {item.item.customer.customer_first_name + ' ' + item.item.customer.customer_last_name}
                      </Text>

                      <Stars
                        disabled
                        default={parseFloat(item.item.rating)}
                        count={5}
                        half
                        fullStar={
                          <Icon
                            name={'star'}
                            style={{
                              color: '#eea532',
                              backgroundColor: 'transparent',
                              fontSize: 18
                            }}
                          />
                        }
                        emptyStar={
                          <Icon
                            name={'star-outline'}
                            style={{
                              color: '#eea532',
                              backgroundColor: 'transparent',
                              fontSize: 17,
                              paddingTop: 1
                            }}
                          />
                        }
                        halfStar={
                          <Icon
                            name={'star-half'}
                            style={{
                              color: '#eea532',
                              backgroundColor: 'transparent',
                              fontSize: 18
                            }}
                          />
                        }
                      />
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        backfaceVisibility: 'hidden',
                        backgroundColor: this.props.themeStyle.secondryBackgroundColor,
                        alignContent: 'center',
                        flexDirection: 'row'
                      }}>
                    </View>
                    <Text
                      style={{
                        fontSize: appTextStyle.mediumSize,
                        fontFamily: appTextStyle.fontFamily,
                        paddingLeft: 4,
                        paddingTop: 6,
                        color: this.props.themeStyle.textColor
                      }}>{`${item.item.title}`}</Text>
                  </View>
                </View>
              )}
            />

            <Dialog
              visible={this.state.visible}
              onTouchOutside={() => {
                this.setState({ visible: false })
              }}
              dialogTitle={
                <DialogTitle
                  style={{
                    backgroundColor: this.props.themeStyle.primary,
                    color: this.props.themeStyle.textColor,
                    width: 300
                  }}
                  textStyle={{ color: this.props.themeStyle.textColor, fontSize: 20 }}
                  title={this.props.isLoading.appConfig.languageJson['Rate Product']}
                />
              }>
              <DialogContent style={{ backgroundColor: this.props.themeStyle.primaryBackgroundColor }}>
                <View style={{ padding: 8 }}>
                  <Stars
                    default={parseFloat(1)}
                    update={val => {
                      this.setState({ rating: val })
                    }}
                    count={5}
                    starSize={60}
                    fullStar={<Icon name={'star'} style={[styles.myStarStyle,
                      { color: this.props.themeStyle.primary }]} />}
                    emptyStar={
                      <Icon
                        name={'star-outline'}
                        style={[styles.myStarStyle, styles.myEmptyStarStyle,
                          { color: this.props.themeStyle.textColor }]}
                      />
                    }
                    halfStar={
                      <Icon name={'star-half'} style={[styles.myStarStyle,
                        { color: this.props.themeStyle.primary }]} />
                    }
                  />
                </View>

                <View
                  style={[styles.textBox, {
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }]}>
                  <TextInput
                    value={this.state.description}
                    onChangeText={text => this.setState({ description: text })}
                    placeholder={
                      this.props.isLoading.appConfig.languageJson['Your Messsage']
                    }
                    placeholderTextColor={'#c1c1c1'}
                    style={[styles.textInputStyle, {
                      color: this.props.themeStyle.textColor
                    }]}
                    editable={true}
                    multiline={true}
                    numberOfLines={5}
                  />
                </View>
                <View style={{ paddingLeft: 160, paddingTop: 5, backgroundColor: this.props.themeStyle.primaryBackgroundColor }}>
                  <Button
                    disabled={!isEnabled}
                    onPress={() => {
                      this.setState({
                        visible: false,
                        spinnerTemp: true
                      }, () => this.addComment())
                    }}
                    title={this.props.isLoading.appConfig.languageJson.Done}
                    color={this.props.themeStyle.primary}
                  />
                </View>
              </DialogContent>
            </Dialog>
          </View>
        </ScrollView>
      </View>

    )
  }
}
const getTheme = (state) => state.appConfig.themeStyle
const getSettings = (state) => state.settingsCall.settings

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
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  isLoading: state,
  settings: getSettingsFun(state)
})

export default connect(mapStateToProps, null)(RatingScreen)

const styles = StyleSheet.create({
  avgRatingView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8
  },
  myStarStyle: {
    backgroundColor: 'transparent',
    fontSize: 30,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  cardInnerView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backfaceVisibility: 'hidden',
    alignContent: 'center',
    width: Width2 * 0.8,
    padding: 8,
    paddingLeft: 4,
    paddingTop: 10
  },
  btnView: {
    marginTop: 20,
    width: Width2 * 0.9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressBarView: {
    paddingTop: 2, paddingHorizontal: 5
  },
  myStarStyle2: {
    color: '#979393',
    backgroundColor: 'transparent',
    fontSize: 28,
    paddingTop: 5,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  myEmptyStarStyle: {
    color: '#e0e0e0'
  },
  input: {
    width: 200,
    height: 40
  },
  imageView: {
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
    overflow: 'hidden',
    marginRight: 8
  },
  innerRowView: {
    flexDirection: 'row',
    width: Width2 * 0.7,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardView: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: Width2,
    padding: 12,
    borderColor: 'gray',
    flexDirection: 'row',
    marginBottom: 5,
    paddingVertical: 16
  },
  textBox: {
    margin: 4,
    borderColor: '#c1c1c1',
    borderWidth: 1
  },
  firsyHalfRatingView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: Width2 * 0.4
  },
  avgConstValueTextm: {
    paddingHorizontal: 4,
    paddingTop: 3
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20

  },
  textInputStyle: {
    marginTop: 2,
    height: 130,
    width: '97%',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    margin: 6,
    paddingLeft: 6,
    fontSize: appTextStyle.mediumSize,
    borderRadius: appTextStyle.customRadius - 11,
    textAlignVertical: 'top',
    alignItems: 'flex-start'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Width2
  },
  ratingView: {
    padding: 8,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  totalRatingText: {
    fontSize: appTextStyle.largeSize + 6,
    paddingLeft: 15,
    paddingTop: 5
  }
})
