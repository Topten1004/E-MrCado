import React, { PureComponent } from 'react'
import { View, Text, Platform, StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import { UIActivityIndicator } from 'react-native-indicators'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { connect } from 'react-redux'
import CategoryFlatList from '../common/CategoriesFlatList'
import { createSelector } from 'reselect'
import Header from '../common/HeaderCustom'
import { appTextStyle } from '../common/Theme.style'

class Category2 extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      activityIndicatorTemp: false
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language.Category,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
    this.setState({ activityIndicatorTemp: false })
  }

  render () {
    return this.state.activityIndicatorTemp ? (
      <View
        style={styles.indicatorView}>
        <UIActivityIndicator
          size={27}
          color={this.props.themeStyle.primary}
        />
      </View>
    ) : (
      <View style={{
        flex: 1,
        backgroundColor: this.props.themeStyle.secondryBackgroundColor
      }}>
        <Header backIcon={this.props.navigation.dangerouslyGetParent().state.index >= 0} menuIcon={!(this.props.navigation.dangerouslyGetParent().state.index >= 1)} cartIcon={true} navigation={this.props.navigation} name={this.props.language.Category} navigation={this.props.navigation} />

        {this.props.sortCategory.length === 0 ? (
          <View
            style={styles.emptyProductView}>
            <View
              style={styles.emptyProductInnerView}>
              <Icon
                name={'logo-dropbox'}
                style={{ color: 'gray', fontSize: 80 }}
              />

              <Text style={{
                fontSize: appTextStyle.largeSize + 2,
                fontFamily: appTextStyle.fontFamily,
                color: this.props.themeStyle.textColor
              }}>
                {this.props.language['No Products Found']}
              </Text>
            </View>
          </View>
        ) : (
          <CategoryFlatList
            dataSource={this.props.sortCategory}
            products={this.props.language.Products}
            allCategories={this.props.sortCategory}
            props={this.props}
            noOfCol={1}
            categoryPage={2}
          />
        )}
      </View>
    )
  }
}
/// ///////////////////////////////////////////////
/// ///////////////////////////////////////////////
const getTheme = (state) => state.appConfig.themeStyle
const getLanguage = (state) => state.appConfig.languageJson
const getCategories = (state) => state.getCategories.sortCategory
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const getCategoriesFun = createSelector(
  [getCategories],
  (getCategories) => {
    return getCategories
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
  language: getLanguageFun(state),
  sortCategory: getCategoriesFun(state)
})
/// //////////////////////////////////////////
export default connect(mapStateToProps, null)(Category2)
const styles = StyleSheet.create({
  indicatorView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  emptyProductView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center'
  },
  emptyProductInnerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    alignSelf: 'center'
  }
})
