import React, { Component } from 'react'
import {
  View,
  FlatList,
  Dimensions,
  Platform
} from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import theme from './Theme.style'
import Category1Style from './Categories1'
import Category2Style from './Categories2'
import Category5Style from './Categories5'
import Category3Style from './Categories3'
import Category4Style from './Categories4'
import Category6Style from './Categories6'
import Category61Style from './Categories61'
import Category62Style from './Categories62'
import Category63Style from './Categories63'

import Loader from 'react-native-easy-content-loader'
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
class FlatListView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      isLoading: true,
      page: 11,
      refreshing: false,
      loading: false,
      timeValue: 400,
      parentIdNumber:
      this.props.props.navigation.state.params !== undefined
        ? this.props.props.navigation.state.params !== null &&
          this.props.props.navigation !== undefined
          ? this.props.props.navigation.state.params.id
          : 0
        : 0
    }

    if (this.state.parentIdNumber === undefined || this.state.parentIdNumber === null) this.state.parentIdNumber = 0
  }

  static getDerivedStateFromProps (props, state) {
    return {
      dataSource: props.dataSource
    }
  }

  componentDidMount () {
    if ((this.props.props.navigation.state.params === undefined || this.props.props.navigation.state.params === null)) {
      this.setState({ dataSource: this.props.dataSource })
    } else {
      this.setState({ dataSource: this.getCategories(this.props.props.navigation.state.params.id) })
    }
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

  checkCategoriesHasChild (parentId) {
    if (this.getCategories(parentId).length === 0) return false
    else return true
  }

  openSubCategories = (parent, name) => {
    if (this.checkCategoriesHasChild(parent.id)) {
      this.props.props.navigation.push('Category', {
        id: parent.id
      })
    } else {
      this.props.props.navigation.push('NewestScreen', {
        id: parent.id
      })
    }
  }

  openSubCategories2 = (parent, name, noOfCol) => {
    if (this.checkCategoriesHasChild(parent.id)) {
      this.props.props.navigation.push('Category', {
        id: parent.id
      })
    } else {
      this.props.props.navigation.push('NewestScreen', {
        id: parent.id
      })
    }
  }

  renderSeparator = () => (
    <View style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
  )

  getListOfCategories = () => {
    let arr = []
    if (this.state.parentIdNumber === 0) { arr = this.state.dataSource } else { arr = this.getCategories(this.state.parentIdNumber) }
    return arr
  }

  getCategories = (parentId) => {
    const cat = []
    for (const value of this.props.getAllCategoriesData) {
      if (value.parent === parentId) {
        cat.push(value)
      }
    }
    return cat
  }

  render () {
    let { loading } = this.state
    if (this.state.dataSource.length > 0) {
      loading = false
      this.state.timeValue = 400
    } else {
      loading = true
      this.state.timeValue = 400
    }
    return this.state.dataSource.length === 0 &&
      this.props.categoryPage !== 6 &&
      this.props.categoryPage !== 61 &&
      this.props.categoryPage !== 1 ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: this.props.themeStyle.secondryBackgroundColor
        }}>
          <UIActivityIndicator size={27} color={theme.loadingIndicatorColor} />
        </View>
      ) : (
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={
            this.state.dataSource.length === 0
              ? ['', '', '', '', '', '', '', '', '', '']
              : this.getListOfCategories()
          }
          tabLabel={this.props.tabLabel}
          horizontal={this.props.vertical}
          numColumns={!this.props.viewButton ? this.props.noOfCol : 2}
          contentContainerStyle={{
            backgroundColor: this.props.themeStyle.secondryBackgroundColor,
            paddingTop: 10
          }}
          ListFooterComponentStyle={{
            backgroundColor: this.props.themeStyle.secondryBackgroundColor
          }}
          style={
            this.props.noOfCol === 3
              ? {
                backgroundColor: this.props.themeStyle.secondryBackgroundColor,
                paddingBottom: this.props.viewButton ? 0 : 10
              }
              : {
                backgroundColor: this.props.themeStyle.secondryBackgroundColor,
                paddingBottom: this.props.viewButton ? 0 : 10
              }
          }
          ItemSeparatorComponent={
            this.props.separator ? this.renderSeparator : null
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={item =>
            this.props.categoryPage === 1 &&
            this.props.noOfCol === 3 &&
            item.index < 6 ? (
                <Loader
                  secondaryColor='rgba(208, 205, 205, 1)'
                  primaryColor='rgba(218, 215, 215, 1)'
                  animationDuration={400}
                  loading={loading}
                  containerStyles={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: HEIGHT * 0.19,
                    width: this.props.noShadow ? WIDTH * 0.3 : WIDTH * 0.71,
                    shadowOffset: { width: 1, height: 1 },
                    shadowColor: theme.textColor,
                    shadowOpacity: 0.5,
                    elevation: 3,
                    margin: 5,
                    marginTop: 6,
                    padding: 5,
                    alignSelf: 'center',
                    marginLeft: Platform.OS === 'ios' ? 6 : 5
                  }}
                  pRows={1}
                  pWidth={['100%']}
                  pHeight={12}
                  titleStyles={{
                    height: HEIGHT * 0.11,
                    width: this.props.noShadow ? WIDTH * 0.3 : WIDTH * 0.71,
                    margin: 5,
                    alignSelf: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0,
                    borderWidth: 0,
                    padding: 5
                  }}>
                  {this.state.dataSource.length > 0 && item.index < 6 ? (
                    <Category1Style
                      item={item.item}
                      id={item.index}
                      noOfCol={2}
                      noShadow={!!this.props.noShadow}
                      sizeChange={!!this.props.sizeChange}
                      products={this.props.products}

                      openSubCategories={(t, n) => this.openSubCategories2(t, n, 2)}
                    />
                  ) : null}
                </Loader>
              ) : this.props.categoryPage === 1 && this.props.noOfCol !== 3 ? (
                <Loader
                  secondaryColor='rgba(208, 205, 205, 1)'
                  primaryColor='rgba(218, 215, 215, 1)'
                  animationDuration={400}
                  loading={loading}
                  containerStyles={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: HEIGHT * 0.19,
                    width: this.props.noShadow ? WIDTH * 0.43 : WIDTH * 0.471,
                    shadowOffset: { width: 1, height: 1 },
                    shadowColor: theme.textColor,
                    shadowOpacity: 0.5,
                    elevation: 3,
                    margin: 5,
                    marginTop: 6,
                    padding: 5,
                    alignSelf: 'center',
                    marginLeft: Platform.OS === 'ios' ? 6 : 5
                  }}
                  pRows={1}
                  pWidth={['100%']}
                  pHeight={12}
                  titleStyles={{
                    height: HEIGHT * 0.16,
                    width: this.props.noShadow ? WIDTH * 0.43 : WIDTH * 0.471,
                    margin: 5,
                    alignSelf: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 0,
                    borderWidth: 0,
                    padding: 5
                  }}>
                  {this.state.dataSource.length > 0 ? (
                    <Category1Style
                      item={item.item}
                      id={item.index}
                      noShadow={!!this.props.noShadow}
                      sizeChange={!!this.props.sizeChange}
                      products={this.props.products}

                      openSubCategories={(t, n) => this.openSubCategories2(t, n, 2)}
                    />
                  ) : null}
                </Loader>
              ) : this.props.categoryPage === 3 ? (
                this.state.dataSource.length > 0 ? (
                  <Category3Style
                    item={item.item}
                    id={item.index}
                    products={this.props.products}
                    openSubCategories={(t, n) => this.openSubCategories(t, n)}
                  />
                ) : null
              ) : this.props.categoryPage === 2 ? (
                this.state.dataSource.length > 0 ? (
                  <Category2Style
                    item={item.item}
                    id={item.index}
                    products={this.props.products}
                    openSubCategories={(t, n) => this.openSubCategories(t, n)}
                  />
                ) : null
              )
                : this.props.categoryPage === 5 ? (
                  this.state.dataSource.length > 0 ? (
                    <Category5Style
                      item={item.item}
                      id={item.index}
                      products={this.props.products}
                      openSubCategories={(t, n) => this.openSubCategories(t, n)}
                    />
                  ) : null
                )
                  : this.props.categoryPage === 4 ? (
                    this.state.dataSource.length > 0 ? (
                      <Category4Style
                        item={item.item}
                        id={item.index}
                        products={this.props.products}
                        openSubCategories={(t, n) => this.openSubCategories(t, n)}
                      />
                    ) : null
                  ) : this.props.categoryPage === 6 ? (
                    <Loader
                      secondaryColor='rgba(208, 205, 205, 1)'
                      primaryColor='rgba(218, 215, 215, 1)'
                      animationDuration={400}
                      loading={loading}
                      containerStyles={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 250,
                        width: WIDTH * 0.97,
                        shadowOffset: { width: 1, height: 1 },
                        shadowColor: theme.textColor,
                        shadowOpacity: 0.5,
                        elevation: 3,
                        margin: 5,
                        padding: 5,
                        alignSelf: 'center'
                      }}
                      pRows={null}
                      titleStyles={{
                        height: 250,
                        width: WIDTH * 0.97,
                        margin: 5,
                        alignSelf: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 0,
                        borderWidth: 0,
                        padding: 5
                      }}>
                      {this.state.dataSource.length > 0 ? (
                        <Category6Style
                          item={item.item}
                          id={item.index}
                          products={this.props.products}

                          openSubCategories={(t, n) => this.openSubCategories(t, n)}
                        />
                      ) : null}
                    </Loader>
                  ) : this.props.categoryPage === 61 ? (
                    <Loader
                      secondaryColor='rgba(208, 205, 205, 1)'
                      primaryColor='rgba(218, 215, 215, 1)'
                      animationDuration={400}
                      loading={loading}
                      containerStyles={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: HEIGHT * 0.34,
                        width: WIDTH * 0.43,
                        shadowOffset: { width: 1, height: 1 },
                        shadowColor: theme.textColor,
                        shadowOpacity: 0.5,
                        elevation: 3,
                        margin: 5,
                        padding: 5,
                        alignSelf: 'center'
                      }}
                      pRows={1}
                      pWidth={['100%']}
                      pHeight={8}
                      titleStyles={{
                        height: HEIGHT * 0.28,
                        width: WIDTH * 0.43,
                        margin: 5,
                        alignSelf: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 0,
                        borderWidth: 0,
                        padding: 5
                      }}>
                      {this.state.dataSource.length > 0 ? (
                        <Category61Style
                          item={item.item}
                          id={item.index}
                          products={this.props.products}
                          viewButton={this.props.viewButton}

                          openSubCategories={(t, n) => this.openSubCategories2(t, n, 2)}
                        />
                      ) : null}
                    </Loader>
                  )
                    : this.props.categoryPage === 62 ? (
                      <Loader
                        secondaryColor='rgba(208, 205, 205, 1)'
                        primaryColor='rgba(218, 215, 215, 1)'
                        animationDuration={400}
                        loading={loading}
                        containerStyles={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: HEIGHT * 0.34,
                          width: WIDTH * 0.43,
                          shadowOffset: { width: 1, height: 1 },
                          shadowColor: theme.textColor,
                          shadowOpacity: 0.5,
                          elevation: 3,
                          margin: 5,
                          padding: 5,
                          alignSelf: 'center'
                        }}
                        pRows={1}
                        pWidth={['100%']}
                        pHeight={8}
                        titleStyles={{
                          height: HEIGHT * 0.28,
                          width: WIDTH * 0.43,
                          margin: 5,
                          alignSelf: 'center',
                          alignContent: 'center',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 0,
                          borderWidth: 0,
                          padding: 5
                        }}>
                        {this.state.dataSource.length > 0 ? (
                          <Category62Style
                            item={item.item}
                            id={item.index}
                            products={this.props.products}
                            viewButton={this.props.viewButton}

                            openSubCategories={(t, n) => this.openSubCategories2(t, n, 2)}
                          />
                        ) : null}
                      </Loader>
                    )
                      : this.props.categoryPage === 63 ? (
                        <Loader
                          secondaryColor='rgba(208, 205, 205, 1)'
                          primaryColor='rgba(218, 215, 215, 1)'
                          animationDuration={400}
                          loading={loading}
                          containerStyles={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: HEIGHT * 0.34,
                            width: WIDTH * 0.43,
                            shadowOffset: { width: 1, height: 1 },
                            shadowColor: theme.textColor,
                            shadowOpacity: 0.5,
                            elevation: 3,
                            margin: 5,
                            padding: 5,
                            alignSelf: 'center'
                          }}
                          pRows={1}
                          pWidth={['100%']}
                          pHeight={8}
                          titleStyles={{
                            height: HEIGHT * 0.28,
                            width: WIDTH * 0.43,
                            margin: 5,
                            alignSelf: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 0,
                            borderWidth: 0,
                            padding: 5
                          }}>
                          {this.state.dataSource.length > 0 ? (
                            <Category63Style
                              item={item.item}
                              id={item.index}
                              products={this.props.products}
                              viewButton={this.props.viewButton}

                              openSubCategories={(t, n) => this.openSubCategories2(t, n, 2)}
                            />
                          ) : null}
                        </Loader>
                      ) : null
          }
        />
      )
  }
}

const getCategories = (state) => state.getCategories.sortCategory
const getAllCategories = (state) => state.getCategories.categories

const getAllCategoriesFun = createSelector(
  [getAllCategories],
  (getAllCategories) => {
    return getAllCategories
  }
)
const getCategoriesFun = createSelector(
  [getCategories],
  (getCategories) => {
    return getCategories
  }
)
const getTheme = (state) => state.appConfig.themeStyle
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  categories: getCategoriesFun(state),
  getAllCategoriesData: getAllCategoriesFun(state)
})
export default connect(mapStateToProps, null)(FlatListView)
