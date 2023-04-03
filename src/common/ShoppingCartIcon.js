import React from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { Icon } from 'native-base'
import { createSelector } from 'reselect'
import SyncStorage from 'sync-storage'
import { appTextStyle } from './Theme.style'
const ShoppingCartIcon = props =>
  SyncStorage.get('bottom') ? (
    <View
      style={[
        {
          padding: 5,
          paddingTop: Platform.OS === 'ios' ? 20 : 5,
          paddingRight: 6
        },
        styles.maincontainer
      ]}>
      <TouchableOpacity onPressOut={() => props.navigation.navigate('Search')}>
        <View
          style={{
            alignItems: 'center',
            height: 40
          }}>
          <View
            style={[
              { padding: 5, paddingRight: 9, paddingTop: 2 },
              Platform.OS === 'android' ? styles.iconContainer : null
            ]}>
            <Icon
              name='search'
              style={{ color: this.props.themeStyle.primary, fontSize: 22 }}
            />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Cart')
        }}>
        <View
          style={{
            alignItems: 'center',
            height: 43
          }}>
          <View
            style={[
              { padding: 5 },
              Platform.OS === 'android' ? styles.iconContainer : null
            ]}>
            <View
              style={{
                position: 'absolute',
                height: 19,
                width: 20,
                borderRadius: appTextStyle.customRadius - 11,
                backgroundColor: this.props.themeStyle.textColor,
                right: -2,
                bottom: 16,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000
              }}>
              <Text
                style={{
                  color: this.props.themeStyle.primary,
                  fontWeight: '500',
                  alignSelf: 'center',
                  fontFamily: appTextStyle.fontFamily
                }}>
                {'1'}
              </Text>
            </View>
            <Icon
              name='cart'
              style={{ color: this.props.themeStyle.textColor, fontSize: 22 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate('Cart')
      }}>
      <View
        style={{
          alignItems: 'center',
          height: 43,
          marginRight: 5,
          marginTop: 9
        }}>
        <View
          style={[
            { padding: 5 },
            Platform.OS === 'android' ? styles.iconContainer : null
          ]}>
          <View
            style={{
              position: 'absolute',
              height: 19,
              width: 25,
              borderRadius: appTextStyle.customRadius - 11,
              backgroundColor: this.props.themeStyle.primary,
              right: -8,
              bottom: 16,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000
            }}>
            <Text
              style={{
                color: this.props.themeStyle.textColor,
                fontWeight: '500',
                alignSelf: 'center',
                fontFamily: appTextStyle.fontFamily
              }}>
              {'1'}
            </Text>
          </View>
          <Icon name='cart' style={{ color: props.tintColor, fontSize: 22 }} />
        </View>
      </View>
    </TouchableOpacity>
  )
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
export default connect(mapStateToProps, null)(withNavigation(ShoppingCartIcon))

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  iconContainer: {
    paddingLeft: 10,
    paddingTop: 10,
    marginRight: 5
  }
})
