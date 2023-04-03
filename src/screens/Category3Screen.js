import React, { PureComponent } from 'react'
import { View, Text, Platform, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import { Icon } from 'native-base'
import { UIActivityIndicator } from 'react-native-indicators'
import { CardStyleInterpolators } from 'react-navigation-stack'
import CategoryFlatList from '../common/CategoriesFlatList'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import Header from '../common/HeaderCustom'
import { appTextStyle } from '../common/Theme.style'
import downIcon from '../images/down_dark.png'
import nextIcon from '../images/next_dark.png'

class Category3 extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      activityIndicatorTemp: false,
      activeId: 0,
      categories: [
        { id: 1, title: 'Home Supply', imgLink: require('../images/IntroImages/slide2.jpg'), active: false },
        { id: 2, title: 'Kitchenware &\n Tableware', imgLink: require('../images/IntroImages/slide3.jpg'), active: false },
        { id: 3, title: 'Electronic', imgLink: require('../images/IntroImages/slide2.jpg'), active: false },
        { id: 4, title: 'Grocery', imgLink: require('../images/IntroImages/slide3.jpg'), active: false }
      ]
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

  setActiveItem (value) {
    let id = value
    if (value === this.state.activeId) {
      id = 0
    }

    this.setState(state => ({
      ...state,
      activeId: id
    }))
  }

  render () {
    // old code
    // return this.state.activityIndicatorTemp ? (
    //   <View
    //     style={styles.indicatorView}>
    //     <UIActivityIndicator
    //       size={27}
    //       color={this.props.themeStyle.primary}
    //     />
    //   </View>
    // ) : (
    //   <View style={{
    //     flex: 1,
    //     backgroundColor: this.props.themeStyle.secondryBackgroundColor
    //   }}>
    //     <Header backIcon={this.props.navigation.dangerouslyGetParent().state.index >= 0} menuIcon={!(this.props.navigation.dangerouslyGetParent().state.index >= 1)} cartIcon={true} navigation={this.props.navigation} name={this.props.language.Category} />
    //     {this.props.sortCategory.length === 0 ? (
    //       <View
    //         style={styles.emptyProductView}>
    //         <View
    //           style={styles.emptyProductInnerView}>
    //           <Icon
    //             name={'logo-dropbox'}
    //             style={{ color: 'gray', fontSize: 80 }}
    //           />

    //           <Text style={{
    //             fontSize: appTextStyle.largeSize + 2,
    //             fontFamily: appTextStyle.fontFamily,
    //             color: this.props.themeStyle.textColor
    //           }}>
    //             {this.props.language['No Products Found']}
    //           </Text>
    //         </View>
    //       </View>
    //     ) : (
    //       <CategoryFlatList
    //         dataSource={this.props.sortCategory}
    //         products={this.props.language.Products}
    //         allCategories={this.props.sortCategory}
    //         props={this.props}
    //         noOfCol={2}
    //         categoryPage={3}
    //         separator={false}
    //       />
    //     )}
    //   </View>
    // )
    return (
      <View style={styles.flexColumn}>
        <Header searchIcon={true} menuIcon={true} cartIcon={true} navigation={this.props.navigation} />
        <View style={styles.container}>
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginTxt}>Log in</Text>
          </TouchableOpacity>
          <ScrollView style={styles.cateContainer}>
            {this.state.categories.map((item, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={[styles.flexRow, styles.cateItem, styles.borderShadow]}
                  onPress={() => this.setActiveItem(item.id)}
                >
                  <View style={styles.flexRow}>
                    <Image source={item.imgLink} style={styles.cateImg} />
                    <Text style={styles.styleTxt}>{item.title}</Text>
                  </View>
                  <Image source={this.state.activeId === item.id ? nextIcon : downIcon} />
                </TouchableOpacity>
                { this.state.activeId === item.id &&
                  <View style={styles.subContainer}>
                    {this.state.categories.map((subItem, subIndex) => (
                      <TouchableOpacity key={subIndex} style={[styles.flexRow, styles.subItem, styles.borderShadow]}>
                        <View style={styles.flexRow}>
                          <Image source={subItem.imgLink} style={styles.subImg} />
                          <Text style={styles.styleTxt}>{subItem.title}</Text>
                        </View>
                        <Image source={downIcon} />
                      </TouchableOpacity>
                    ))}
                  </View>
                }
              </View>
            ))}
          </ScrollView>
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
export default connect(mapStateToProps, null)(Category3)
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
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  borderShadow: {
    elevation: 5,
    shadowColor: '#171717'
  },
  styleTxt: {
    fontWeight: '700',
    color: 'black',
    fontSize: 22
  },

  container: {
    padding: 20
  },

  loginBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcc922',
    height: 60
  },
  loginTxt: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700'
  },

  cateContainer: {

  },
  cateItem: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: 100
  },
  cateImg: {
    width: 100,
    height: 70,
    marginRight: 20
  },
  subContainer: {

  },
  subItem: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'lightgray',
    height: 80
  },
  subImg: {
    width: 80,
    height: 60,
    marginRight: 20
  }
})
