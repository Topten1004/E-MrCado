import React, { PureComponent } from 'react'
import { StyleSheet, View, Text, FlatList, Dimensions } from 'react-native'
import { Icon } from 'native-base'
import { UIActivityIndicator } from 'react-native-indicators'
import { connect } from 'react-redux'
import CategoriesVerticaleRow from '../common/CategoriesVerticaleRow'
import Categories6 from '../common/Categories6'
import { createSelector } from 'reselect'
import Header from '../common/HeaderCustom'
import { appTextStyle } from '../common/Theme.style'

const WIDTH = Dimensions.get('window').width

class Category6 extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      activityIndicatorTemp: false,
      selectedIndex: 0,
      categoryArray: [],
      parentIdNumber:
      this.props.navigation.state.params !== undefined
        ? this.props.navigation.state.params !== null &&
          this.props.navigation !== undefined
          ? this.props.navigation.state.params.id
          : 0
        : 0,
      parentObject: {},
      segment: '0'

    }
    if (this.state.parentIdNumber === undefined || this.state.parentIdNumber === null) this.state.parentIdNumber = 0
  }

  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language.Category,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
    this.setState({ activityIndicatorTemp: false })
  }

  getCategories (parentId) {
    const cat = []
    for (const value of this.props.getAllCategoriesData) {
      if (value.parent === parentId) {
        cat.push(value)
      }
    }
    return cat
  }

  getCategoryObject = (id) => {
    let obj = {}
    for (const value of this.props.getAllCategoriesData) {
      if (value.id === id) { obj = value }
    }
    return obj
  }

  checkCategoriesHasChild (parentId) {
    if (this.getCategories(parentId).length === 0) return false
    else return true
  }

  renderItem = (item, index) => <CategoriesVerticaleRow
    item={item.item}
    id={item.index}
    selectedIndex={this.state.selectedIndex}
    products={this.props.language.Products}
    openSubCategories={(t, n, id) => {
      const temp = this.getCategories(t.id)
      this.setState({
        categoryArray: temp,
        selectedIndex: id
      })
    }}
  />

  renderItem2 = (item, index) => <Categories6
    item={item.item}
    id={item.index}
    products={this.props.language.Products}
    openSubCategories={(t, n) => this.openSubCategories(t, n)}
  />

  openSubCategories = (parent, name) => {
    if (this.checkCategoriesHasChild(parent.id)) {
      this.props.navigation.push('Category', {
        id: parent.id
      })
    } else {
      this.props.navigation.push('NewestScreen', {
        id: parent.id
      })
    }
  }

  getListOfCategories = () => {
    let arr = []
    if (this.state.parentIdNumber === 0) {
      arr = this.props.sortCategory
    } else { arr = this.getCategories(this.state.parentIdNumber) }
    return arr
  }

  getListOfCategories2 = () => {
    let arr = []

    if (this.state.selectedIndex === 0) {
      arr = this.getCategories(this.getListOfCategories()[0].id)
    } else {
      arr = this.state.categoryArray
    }

    return arr
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
      <View style={{ flex: 1 }}>
        <Header backIcon={this.props.navigation.dangerouslyGetParent().state.index >= 0} menuIcon={!(this.props.navigation.dangerouslyGetParent().state.index >= 1)} cartIcon={true} navigation={this.props.navigation} name={this.props.language.Category} navigation={this.props.navigation} />

        <View style={{
          flex: 1,
          backgroundColor: this.props.themeStyle.secondryBackgroundColor,
          flexDirection: 'row'
        }}>
          <View style={{ flex: 1 }}>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.getListOfCategories()}
              key={this.state.productView}
              numColumns={1}
              ref={ref => {
                this.flatListRef = ref
              }}
              contentContainerStyle={{
                backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: WIDTH * 0.25,
                flex: 1,
                shadowOffset: { width: 1, height: 1 },
                shadowColor: '#000',
                shadowOpacity: 0.3,
                elevation: 3
              }}
              renderItem={this.renderItem}
            />
          </View>

          <View style={{ flex: 3 }}>

            {

              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.getListOfCategories2()}
                key={this.state.productView}
                numColumns={4}
                ref={ref => {
                  this.flatListRef = ref
                }}
                renderItem={this.renderItem2}
              />
            }
          </View>
        </View>
      </View>
    )
  }
}
/// ///////////////////////////////////////////////
/// ///////////////////////////////////////////////
const getTheme = (state) => state.appConfig.themeStyle
const getLanguage = (state) => state.appConfig.languageJson
const getCategories = (state) => state.getCategories.sortCategory
const getAllCategories = (state) => state.getCategories.categories

const getAllCategoriesFun = createSelector(
  [getAllCategories],
  (getAllCategories) => {
    return getAllCategories
  }
)
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
  sortCategory: getCategoriesFun(state),
  getAllCategoriesData: getAllCategoriesFun(state)
})
/// //////////////////////////////////////////
export default connect(mapStateToProps, null)(Category6)
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
