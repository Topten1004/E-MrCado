import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  I18nManager,
  Platform
} from 'react-native'
import { ListItem } from 'native-base'
import FontIcon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import ImageLoad from '../common/RnImagePlaceH'
import { appTextStyle } from '../common/Theme.style'
import { createSelector } from 'reselect'
import { getThumbnailImage } from '../common/WooComFetch'

class ExpandableListView extends Component {
  constructor () {
    super()
    this.state = {
      layoutHeight: 0,
      dropdownValue: 0,
      dropdownValue1: [0, 0, 0],
      expend: true
    }
  }

  static getDerivedStateFromProps (props) {
    if (props.item.expanded) {
      return {
        layoutHeight: null
      }
    } else {
      return {
        layoutHeight: 0
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if ((this.state.layoutHeight !== nextState.layoutHeight) ||
   (this.props.themeStyle !== nextProps.themeStyle)) {
      return true
    }
    return false
  }

  getCategories (parentId) {
    const cat = []
    for (const value of this.props.categories) {
      if (value.parent === parentId) {
        cat.push(value)
      }
    }
    return cat
  }

  showSelectedCategory = item => {
    this.props.navigation.navigate('NewestScreen', { id: item.id })
  }

  dropdownValueFun = () => {
  }

  render () {
    if (this.state.dropdownValue1[this.props.count] === 0) {
      this.state.dropdownValue1[this.props.count] = 1
    } else {
      this.state.dropdownValue1[this.props.count] = 0
    }
    return (
      <View
        style={{
          padding: 0
        }}>
        <ListItem noIndent={true}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={this.dropdownValueFun}
            onPress={this.props.onClickFunction}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: this.props.themeStyle.primaryBackgroundColor
            }}>
            <View style={styles.tabComponents}>

              {this.props.item.icon !== undefined &&
              this.props.item.icon !== '' && this.props.item.icon !== null
                ? <ImageLoad
                  key={0}
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: I18nManager.isRTL ? 8 : 0,
                    marginLeft: 3
                  }}
                  loadingStyle={{ size: 'large', color: this.props.themeStyle.primary }}
                  placeholder={false}
                  ActivityIndicator={true}
                  placeholderStyle={{ width: 0, height: 0 }}
                  source={{ uri: getThumbnailImage() + this.props.item.icon }}
                />
                : null}

              <Text style={{
                textAlign: 'left',
                color: this.props.themeStyle.textColor,
                fontSize: appTextStyle.largeSize,
                fontWeight: '500',
                fontFamily: appTextStyle.fontFamily,
                paddingLeft: 12
              }}>
                {this.props.item.name}{' '}
              </Text>
            </View>

            <FontIcon
              name={
                this.state.dropdownValue1[this.props.count] === 0
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              style={{
                color: this.props.themeStyle.textColor,
                paddingRight: 12,
                paddingLeft: 12,
                fontSize: 10
              }}
            />
          </TouchableOpacity>
        </ListItem>
        <View style={{
          height: this.state.layoutHeight,
          overflow: 'hidden',
          backgroundColor: this.props.themeStyle.secondryBackgroundColor
        }}>
          {this.getCategories(this.props.item.id).map((item, key) => (

            <View key={key}>
              <ListItem noIndent={true}>
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.8}
                  onPress={this.showSelectedCategory.bind(this, item)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: this.props.themeStyle.secondryBackgroundColor
                  }}>
                  <View style={styles.tabComponents}>

                    <Text style={[{
                      textAlign: 'left',
                      color: this.props.themeStyle.secondryBackgroundColor,
                      fontSize: appTextStyle.largeSize,
                      fontFamily: appTextStyle.fontFamily,
                      fontWeight: '500',
                      marginLeft: 38
                    }, { color: this.props.themeStyle.textColor }]}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              </ListItem>
            </View>
          ))}
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

export default connect(mapStateToProps, null)(ExpandableListView)
const styles = StyleSheet.create({
  tabComponents: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4
  }
})
