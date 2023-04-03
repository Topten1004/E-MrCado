import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { createSelector } from 'reselect'
import { appTextStyle } from '../common/Theme.style.js'
import { Icon } from 'native-base'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { ScrollView } from 'react-native-gesture-handler'
const WIDTH = Dimensions.get('window').width
const Height = Dimensions.get('window').height
const DrawerWidth2 = WIDTH * 0.84
const DrawerHeight2 = Height * 0.78
class App extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      attributes: [],
      tempmYarray: [0, 2000],
      tempmYarray2: [0, 2000],
      maxAmount: 2000,
      minAmount: 0,
      price: { lower: 0, upper: 2000 }
    }
  }

  butn = text => {
    return text === this.props.language.Reset ? (
      <TouchableOpacity
        disabled={
          this.props.navigation.state.routes[0].routes[0].params !== undefined
            ? !this.props.navigation.state.routes[0].routes[0].params
              .applyFilter2
            : true
        }
        onPress={text => {
          if (this.props.navigation.state.routes[0].routes[0].params !== undefined) {
            if (this.props.navigation.state.routes[0].routes[0].params.applyFilter2) {
              this.props.navigation.state.routes[0].routes[0].params.resetFilters()
            }
          }
        }}>
        <View
          style={[styles.innerView, {
            backgroundColor: this.props.themeStyle.primaryLight,
            borderRadius: appTextStyle.customRadius - 12
          }]}>
          <Text
            style={{
              textAlign: 'center',
              color:
                this.props.navigation.state.routes[0].routes[0].params !==
                undefined
                  ? this.props.navigation.state.routes[0].routes[0].params
                    .applyFilter2
                    ? this.props.themeStyle.primary
                    : 'gray'
                  : 'gray',
              fontSize: appTextStyle.mediumSize,
              fontWeight: '500',
              fontFamily: appTextStyle.fontFamily
            }}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={text => {
          this.props.navigation.state.routes[0].routes[0].params.applyFilters()
        }}>
        <View
          style={[styles.innerView, {
            backgroundColor: this.props.themeStyle.primary,
            borderRadius: appTextStyle.customRadius - 12,
            width: WIDTH * 0.48

          }]}>
          <Text
            style={{
              textAlign: 'center',
              color: this.props.themeStyle.textTintColor,
              fontSize: appTextStyle.mediumSize,
              fontWeight: '500',
              fontFamily: appTextStyle.fontFamily
            }}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    return (
      <View style={[styles.container, {
        backgroundColor: this.props.themeStyle.primaryBackgroundColor
      }]}>
        <View style={{ flex: 1 }}>
          <View
            style={[styles.mainContainer]}>
            <Text
              style={[styles.filerText, {
                color: this.props.themeStyle.textColor
              }]}>
              {this.props.language.Filters}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.closeDrawer()}>
              <View
                style={styles.headerView}>
                <Icon
                  onPress={() => this.props.navigation.closeDrawer()}
                  name={'md-close'}
                  style={{
                    color: this.props.themeStyle.textColor,
                    paddingHorizontal: 10,
                    fontSize: appTextStyle.largeSize + 3
                  }}
                />

              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={[styles.resetContainer, {
              backgroundColor: this.props.themeStyle.primaryBackgroundColor
            }]}>
            {this.butn(this.props.language.Reset, this)}
            {this.butn(this.props.language.Apply, this)}
          </View>
          <View>
            <Text
              style={[styles.byText, {
                color: this.props.themeStyle.textColor
              }]}>
              {this.props.language.Price}
            </Text>
            <View
              style={styles.sliderView}>
              <MultiSlider
                sliderLength={Number(WIDTH * 0.7)}
                step={1}
                isMarkersSeparated={true}
                values={[
                  this.props.navigation.state.routes[0].routes[0].toString() !==
                    'NaN' &&
                  this.props.navigation.state.routes[0].routes[0] !==
                    undefined &&
                  this.props.navigation.state.routes[0].routes[0].params !==
                    undefined &&
                  this.props.navigation.state.routes[0].routes[0] !== null
                    ? Number(
                      this.props.navigation.state.routes[0].routes[0].params
                        .tempmYarray[0]
                    )
                    : Number(this.state.tempmYarray[0]),
                  this.props.navigation.state.routes[0].routes[0].toString() !==
                    'NaN' &&
                  this.props.navigation.state.routes[0].routes[0] !==
                    undefined &&
                  this.props.navigation.state.routes[0].routes[0].params !==
                    undefined &&
                  this.props.navigation.state.routes[0].routes[0] !== null
                    ? Number(
                      this.props.navigation.state.routes[0].routes[0].params
                        .tempmYarray[1]
                    )
                    : Number(this.state.tempmYarray[1])
                ]}
                touchDimensions={{
                  height: 200,
                  width: 200,
                  borderRadius: 200 / 2,
                  slipDisplacement: 800
                }}
                markerStyle={{
                  height: 20,
                  width: 20,
                  backgroundColor: this.props.themeStyle.primary
                }}
                selectedStyle={{ backgroundColor: this.props.themeStyle.primary }}
                unselectedStyle={{ backgroundColor: '#f618' }}
                snapped={false}
                containerStyle={{ paddingTop: 9 }}
                minMarkerOverlapDistance={0}
                customMarkerLeft={e => {
                  return (
                    <View style={{ marginBottom: 11 }}>
                      <TouchableWithoutFeedback
                        style={{ borderRadius: 8, height: 8, width: 8 }}>
                        <Text style={{
                          fontSize: appTextStyle.smallSize - 3,
                          fontFamily: appTextStyle.fontFamily,
                          color: this.props.themeStyle.textColor
                        }}>{e.currentValue}</Text>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback>
                        <Text
                          style={{
                            borderRadius: 12 / 2,
                            overflow: 'hidden',
                            height: 12,
                            width: 12,
                            backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                            borderWidth: 1,
                            borderColor: this.props.themeStyle.primary,
                            fontFamily: appTextStyle.fontFamily
                          }}>
                          {''}
                        </Text>
                      </TouchableWithoutFeedback>
                    </View>
                  )
                }}
                customMarkerRight={e => {
                  return (
                    <View style={{ marginBottom: 11 }}>
                      <TouchableWithoutFeedback
                        style={{ borderRadius: 8, height: 8, width: 8 }}>
                        <Text style={{ fontSize: appTextStyle.smallSize - 3, color: this.props.themeStyle.textColor }}>{e.currentValue}</Text>
                      </TouchableWithoutFeedback>
                      <TouchableWithoutFeedback>
                        <Text
                          style={{
                            borderRadius: 12 / 2,
                            overflow: 'hidden',
                            height: 12,
                            width: 12,
                            backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                            borderWidth: 1,
                            borderColor: this.props.themeStyle.primary,
                            fontFamily: appTextStyle.fontFamily
                          }}>
                          {''}
                        </Text>
                      </TouchableWithoutFeedback>
                    </View>
                  )
                }}
                min={
                  this.props.navigation.state.routes[0].routes[0].toString() ===
                    'NaN' ||
                  this.props.navigation.state.routes[0].routes[0] ===
                    undefined ||
                  this.props.navigation.state.routes[0].routes[0].params ===
                    undefined ||
                  this.props.navigation.state.routes[0].routes[0] === null
                    ? Number(this.state.minAmount)
                    : Number(
                      this.props.navigation.state.routes[0].routes[0].params
                        .minAmount
                    )
                }
                max={
                  this.props.navigation.state.routes[0].routes[0].toString() ===
                    'NaN' ||
                  this.props.navigation.state.routes[0].routes[0] ===
                    undefined ||
                  this.props.navigation.state.routes[0].routes[0].params ===
                    undefined ||
                  this.props.navigation.state.routes[0].routes[0] === null
                    ? Number(this.state.maxAmount)
                    : Number(
                      this.props.navigation.state.routes[0].routes[0].params
                        .maxAmount
                    )
                }
                onValuesChangeFinish={() => {
                  this.props.navigation.state.routes[0].routes[0].params.onChangeRange(
                    Object.create({
                      lower: this.props.navigation.state.routes[0].routes[0]
                        .params.tempmYarray2[0],
                      upper: this.props.navigation.state.routes[0].routes[0]
                        .params.tempmYarray2[1]
                    })
                  )
                }}
                onValuesChange={values => {
                  this.props.navigation.state.routes[0].routes[0].params.tempmYarray2[0] =
                    values[0]
                  this.props.navigation.state.routes[0].routes[0].params.tempmYarray2[1] =
                    values[1]
                }}
              />
            </View>
          </View>
          <ScrollView style={{ marginBottom: 20 }}>
            {this.props.navigation.state.routes[0].routes[0].toString() !==
              'NaN' &&
            this.props.navigation.state.routes[0].routes[0] !== undefined &&
            this.props.navigation.state.routes[0].routes[0].params !==
              undefined &&
            this.props.navigation.state.routes[0].routes[0] !== null &&
            this.props.navigation.state.routes[0].routes[0].params
              .attributes !== undefined ? (
                this.props.navigation.state.routes[0].routes[0].params.attributes
                  .length !== 0 ? (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={
                        this.props.navigation.state.routes[0].routes[0].params
                          .attributes.length === 0
                          ? []
                          : this.props.navigation.state.routes[0].routes[0].params
                            .attributes
                      }
                      ref={ref => {
                        this.flatListRef = ref
                      }}
                      keyExtractor={(_item, index) => index.toString()}
                      renderItem={item => (
                        <View>
                          <Text
                            style={[styles.attText, {
                              color: this.props.themeStyle.textColor
                            }]}>
                            {item.item.detail[0].name}
                          </Text>

                          <FlatList
                            data={item.item.variations}
                            numColumns={4}
                            keyExtractor={(_item, index) => index.toString()}
                            style={{
                              margin: 8,
                              marginVertical: 10,
                              marginBottom: 40
                            }}
                            renderItem={item2 => (
                              <View>
                                {this.props.navigation.state.routes[0].routes[0].params.singaleRow2(
                                  item.item,
                                  item2.item
                                )}
                              </View>
                            )}
                          />
                        </View>
                      )}
                    />
                  ) : null
              ) : null}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const getLanguage = (state) => state.appConfig.languageJson
const getTheme = (state) => state.appConfig.themeStyle
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
  language: getLanguageFun(state)
})

export default connect(mapStateToProps, null)(withNavigation(App))

const styles = StyleSheet.create({
  innerView: {
    alignItems: 'center',
    height: 33,
    width: WIDTH * 0.25,
    justifyContent: 'center'
  },
  sliderView: {
    flexDirection: 'row',
    marginTop: 10,
    padding: 5,
    marginLeft: WIDTH * 0.034
  },
  resetContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    zIndex: 2,
    position: 'absolute',
    bottom: 0,
    width: DrawerWidth2,
    height: DrawerHeight2 * 0.1
  },
  devider: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd'
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  mainContainer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 0
  },
  byText: {
    fontSize: appTextStyle.largeSize,
    paddingHorizontal: 13,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    fontFamily: appTextStyle.fontFamily
  },
  headerView: {
    alignItems: 'center'
  },
  filerText: {
    paddingLeft: 12,
    textAlign: 'center',
    fontSize: appTextStyle.largeSize,
    fontWeight: 'bold',
    fontFamily: appTextStyle.fontFamily
  },
  attText: {
    fontSize: appTextStyle.mediumSize + 1,
    paddingHorizontal: 13,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    fontFamily: appTextStyle.fontFamily
  }
})
