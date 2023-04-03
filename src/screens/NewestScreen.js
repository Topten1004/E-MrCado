import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  I18nManager,
  Dimensions,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView
} from 'react-native'
import Toast from 'react-native-easy-toast'
import ShoppingCartIcon from '../common/ShoppingCartIcon4'
import { UIActivityIndicator } from 'react-native-indicators'
import { CardStyleInterpolators } from 'react-navigation-stack'
import { withNavigation } from 'react-navigation'
import { ActionSheet, Picker, Icon } from 'native-base'
import { connect } from 'react-redux'
import { getUrl, getHttp } from '../common/WooComFetch'
import FlatListViewShop from '../common/FlatListViewShop'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { appTextStyle } from '../common/Theme.style'
import Spinner from 'react-native-loading-spinner-overlay'
import { createSelector } from 'reselect'
const CANCEL_INDEX = 9
const WIDTH = Dimensions.get('window').width
const Height = Dimensions.get('window').height
class Newest extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerStyle: {
        backgroundColor: colorProps,
        borderBottomWidth: 0,
        shadowColor: 'transparent', // ios
        elevation: 0, // android
        shadowOffset: {
          height: 0
        },
        shadowOpacity: 0
      },
      style: {
        shadowRadius: 0,
        shadowOffset: { height: 0, width: 0 }
      },
      headerHideShadow: true,
      headerTintColor: iconColor,
      headerTitleAlign: 'center',
      headerForceInset: { top: 'never', vertical: 'never' },
      gestureEnabled: false,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 2
      },
      headerRight: () => <ShoppingCartIcon navigation={navigation} />,
      headerLeft: () => (
        <Icon
          onPress={() => navigation.pop()}
          name={!I18nManager.isRTL ? 'arrow-back' : 'arrow-forward'}
          style={{
            color: iconColor,
            fontSize: 22,
            padding: 5,
            paddingLeft: 16,
            paddingRight: 16,
            marginRight: 16
          }}
        />
      )
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      queryAttributes: '',
      attributes: [],
      tempAttributes: [],
      selectedAttributes: [],
      scrollTopButton: false,
      activityIndicatorTemp: true,
      products: [],
      spinnerTemp: false,
      indexTemp: 'price',
      indexTemp2: 'ASC',
      modalVisibleSubCategory: false,
      tempmYarray: [0, 2000],
      tempmYarray2: [0, 2000],
      sortArray: [
        this.props.language.price,
        this.props.language.product_type,
        this.props.language.discount_price,
        this.props.language.product_status,
        this.props.language.product_view,
        this.props.language.seo_desc,
        this.props.language.created_at,
        this.props.language.Cancel
      ],
      sortArray2: [this.props.language.ASC, this.props.language.DESC, this.props.language.Cancel],
      selectedTab:
        this.props.navigation.dangerouslyGetParent() !== undefined
          ? this.props.navigation.dangerouslyGetParent() !== null &&
            this.props.navigation.dangerouslyGetParent() !== undefined
            ? this.props.navigation.dangerouslyGetParent().state.params.id
            : ''
          : '',

      searchString:
        this.props.navigation.dangerouslyGetParent() !== undefined
          ? this.props.navigation.dangerouslyGetParent() !== null &&
            this.props.navigation.dangerouslyGetParent() !== undefined
            ? this.props.navigation.dangerouslyGetParent().state.params.searchString
            : ''
          : '',
      categoryId:
        this.props.navigation.dangerouslyGetParent() !== undefined
          ? this.props.navigation.dangerouslyGetParent() !== null &&
            this.props.navigation.dangerouslyGetParent() !== undefined
            ? this.props.navigation.dangerouslyGetParent().state.params.id
            : ''
          : '',
      categoryName:
        this.props.navigation.dangerouslyGetParent() !== undefined
          ? this.props.navigation.dangerouslyGetParent() !== null &&
            this.props.navigation.dangerouslyGetParent() !== undefined
            ? this.props.navigation.dangerouslyGetParent().state.params.name
            : ''
          : '',
      sortOrder: 'price',
      page: 0,
      applyFilter: false,
      tempApply: false,
      filters: [],
      selectedFilters: [],
      selectedFiltersName: [],
      maxAmount: 2000,
      minAmount: 0,
      price: { lower: 0, upper: 2000 },
      priceData: { lower: 0, upper: 2000 },
      side: 'right',
      productView: 'grid',
      on_sale: '',
      featured: '',
      filterOnSale: false,
      filterFeatured: false,
      loadingServerData: true,
      type:
        this.props.navigation.dangerouslyGetParent() !== undefined
          ? this.props.navigation.dangerouslyGetParent() !== null &&
            this.props.navigation.dangerouslyGetParent() !== undefined
            ? this.props.navigation.dangerouslyGetParent().state.params
              .sortOrder
            : ''
          : '',
      sortByValue: 'ASC',
      listOfFilteredIdsFromCustom: [],
      wrapperCondition: false,
      wrapperConditionDrawer: false,
      saleTemp: true,
      featuredTemp: true,
      radioButton: [],
      emptyBox: [],
      selected: 'key0',
      selected2: 'key0',
      modalVisible: false,
      tempBox: [],
      isEmpty: false,
      allCategories: [],
      selectedCategory: ''

    }
    this.toast = null
    this.props.allCategories.map((val) => {
      this.state.allCategories.push(val)
    })
    this.state.allCategories.unshift({ name: this.props.language.All })
  }

  componentDidMount () {
    this.child = ''
    this.props.navigation.setParams({
      minAmount: 0,
      maxAmount: 2000,
      tempmYarray: [0, 2000],
      tempmYarray2: [0, 2000],
      applyFilter2: this.state.applyFilter,
      singaleRow2: (p, n) => this.singaleRow2(p, n),
      onChangeRange: obj => this.onChangeRange(obj),
      resetFilters: () => this.resetFilters(),
      applyFilters: () => this.applyFilters()
    })

    this.state.sortOrder = 'price'
    this.setState({ activityIndicatorTemp: false })
    this.props.navigation.setParams({
      headerTitle:
        this.props.language.Shop,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
    this.getProducts()
    this.getFilters(this.state.categoryId)

    if (this.state.selectedTab !== '') {
      this.state.allCategories.map((val) => {
        if (this.state.selectedTab === val.id) {
          this.setState({ selectedCategory: val.name })
        }
      })
    }
  }

  applyFilters () {
    this.state.applyFilter = true
    this.state.page = 0
    this.props.navigation.closeDrawer()
    this.setState({ products: [] }, () => {
      this.getProducts()
    })
  }

  setModalVisible = visible => {
    this.setState({ modalVisibleSubCategory: visible })
  }

  resetFilters () {
    this.state.price.lower = 0
    this.state.price.upper = 2000
    this.setState(
      {
        spinnerTemp: true,
        tempApply: false,
        filterFeatured: false,
        filters: [],
        price: this.state.price,
        selectedFilters: [],
        applyFilter: false,
        products: [],
        page: 0,
        searchString: ''
      },
      () => {
        this.getProducts()
        this.getFilters(this.state.selectedTab)
      }
    )
  }

  removeFilters () {
    this.state.price.lower = 0
    this.state.price.upper = 2000
    this.setState(
      {
        applyFilter: false,
        tempApply: false,
        isEmpty: false,
        products: [],
        page: 0,
        sortOrder: 'price',
        selected: 'key0',
        selected2: 'key0',
        indexTemp: 'price',
        indexTemp2: 'ASC',
        selectedSortText: [],
        selectedFilters: [],
        searchString: ''
      },
      () => {
        this.getProducts()
        this.getFilters(this.state.selectedTab)
      }
    )
  }

  getFilters = async id => {
    let url = 'attributes'
    url += '?limit=' + 1000
    url += '&language_id=' + this.props.settings.language_id
    url += '&currency=' + this.props.settings.currency_id
    url += '&getVariation=1'
    url += '&getVariationByLarguage=1'

    const json = await getHttp(getUrl() + url, {})

    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        this.state.tempmYarray[0] = this.state.price.lower
        this.state.tempmYarray[1] = this.state.price.upper
        this.state.tempmYarray2[0] = this.state.price.lower
        this.state.tempmYarray2[1] = this.state.price.upper

        this.props.navigation.setParams({
          minAmount: this.state.price.lower,
          maxAmount: this.state.price.upper,
          tempmYarray: this.state.tempmYarray,
          tempmYarray2: this.state.tempmYarray2,
          attributes: json.data.data,
          applyFilter2: this.state.applyFilter
        })
        this.setState({
          filters: json.data.data,
          spinnerTemp: false
        })
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
  }

  getProducts = async () => {
    var dat = {}
    let url = 'products'
    url += '?limit=' + 10
    url += '&getCategory=1'
    url += '&getDetail=1'
    url += '&language_id=' + this.props.settings.language_id
    url += '&currency=' + this.props.settings.currency_id
    url += '&stock=1'
    url += '&page=' + this.state.page
    url += '&sortBy=' + this.state.sortOrder
    url += '&sortType=' + this.state.sortByValue // (ASC,DESC)

    if (this.state.searchString !== '' &&
      this.state.searchString !== undefined) url += '&searchParameter=' + this.state.searchString

    if (this.props.navigation.dangerouslyGetParent() !== null &&
      this.props.navigation.dangerouslyGetParent() !== undefined) {
      if (this.props.navigation.dangerouslyGetParent().state.params.brand === 'brandId') { url += '&brandId=1' }
    }
    if (this.props.navigation.dangerouslyGetParent() !== null &&
      this.props.navigation.dangerouslyGetParent() !== undefined) {
      if (this.props.navigation.dangerouslyGetParent().state.params.brand === 'topSelling') { url += '&topSelling=1' }
    }
    if (this.props.navigation.dangerouslyGetParent() !== null &&
      this.props.navigation.dangerouslyGetParent() !== undefined) {
      if (this.props.navigation.dangerouslyGetParent().state.params.brand === 'isFeatured') { url += '&isFeatured=1' }
    }
    if (this.state.applyFilter === true) {
      url += '&price_from=' + this.state.price.lower // (ASC,DESC)
      url += '&price_to=' + this.state.price.upper // (ASC,DESC)

      if (this.state.selectedFilters.length !== 0) {
        url += '&variations=' + this.state.selectedFilters
      }
    }

    if (this.state.selectedTab !== '' &&
      this.state.selectedTab !== 0 && this.state.selectedTab !== undefined) { url += '&productCategories=' + this.state.selectedTab }

    const json = await getHttp(getUrl() + url, {})
    if (json.status === 'success') {
      if (json.data.status === 'Success') {
        if (this.state.page === 0) {
          this.state.products = []
        }
        if (json.data.status === 'Success') {
          this.state.page++
          var prod = json.data.data
          for (const value of prod) {
            this.state.products.push(value)
          }
        }
        this.setState({
          isEmpty: json.data.data.length === 0,
          tempApply: false,
          spinnerTemp: false
        })
        this.state.tempmYarray[0] = this.state.price.lower
        this.state.tempmYarray[1] = this.state.price.upper
        this.state.tempmYarray2[0] = this.state.price.lower
        this.state.tempmYarray2[1] = this.state.price.upper
        this.props.navigation.setParams({
          tempmYarray: this.state.tempmYarray,
          tempmYarray2: this.state.tempmYarray2,
          attributes: this.state.filters,
          applyFilter2: this.state.applyFilter
        })
      } else {
        this.toast.show(json.data.message)
        this.setState({
          tempApply: false,
          spinnerTemp: false
        })
      }
    } else {
      this.setState({
        tempApply: false,
        spinnerTemp: false
      })
      this.toast.show(json.data.data.message)
    }
  }

  // changing tab
  changeTab (c) {
    this.state.applyFilter = false
    this.state.page = 0
    if (c === '') this.state.selectedTab = c
    else this.state.selectedTab = c.id
    this.removeFilters()
  }

  onValueChange (value) {
    if (value === 'key0') {
      this.getSortProducts('price')
    } else if (value === 'key1') {
      this.getSortProducts('product_type')
    } else if (value === 'key2') {
      this.getSortProducts('discount_price')
    } else if (value === 'key3') {
      this.getSortProducts('product_status')
    } else if (value === 'key4') {
      this.getSortProducts('product_view')
    } else if (value === 'key5') {
      this.getSortProducts('seo_desc')
    } else if (value === 'key6') {
      this.getSortProducts('created_at')
    }
    this.setState({
      selected: value,
      applyFilter: true
    })
  }

  onValueChange2 (value) {
    if (value === 'key0') {
      this.getSortProducts2('ASC')
    } else if (value === 'key1') {
      this.getSortProducts2('DESC')
    }
    this.setState({
      selected2: value,
      applyFilter: true
    })
  }

  getSortProducts2 (value) {
    this.state.indexTemp2 = value
    if (value === 'ASC') value = 'ASC'
    else if (value === 'DESC') value = 'DESC'

    if (value === this.state.sortByValue) return 0
    else {
      this.state.sortByValue = value
      this.setState(
        { products: [], tempApply: false, page: 0, sortByValue: value },
        () => {
          this.getProducts()
        }
      )
    }
  }

  onChangeRange (obj) {
    this.setState({
      price: obj,
      tempApply: false
    })
  }

  getSortProducts (value) {
    this.state.indexTemp = value
    if (value === 'price') value = 'price'
    else if (value === 'product_type') value = 'product_type'
    else if (value === 'discount_price') value = 'discount_price'
    else if (value === 'product_status') value = 'product_status'
    else if (value === 'product_view') value = 'product_view'
    else if (value === 'seo_desc') value = 'seo_desc'
    else if (value === 'created_at') value = 'created_at'

    if (value === this.state.sortOrder) return 0
    else {
      this.state.sortOrder = value
      this.setState(
        { products: [], tempApply: false, page: 0, sortOrder: value },
        () => {
          this.getProducts()
        }
      )
    }
  }

  changeLayout = () => {
    if (this.state.productView === 'list') {
      this.setState({ productView: 'grid' }, () => {
        this.child.showAlert()
      })
    } else {
      this.setState({ productView: 'list' }, () => {
        this.child.showAlert()
      })
    }
  }

  getNameOfAtt (id) {
    let name
    this.state.filters.forEach(element => {
      element.variations.forEach(elementTwo => {
        if (id === elementTwo.id) {
          name = elementTwo.detail[0].name
        }
      })
    })
    return name
  }

  //= ======================================================================================
  checkAttributeSelected (fValue, id) {
    if (fValue) {
      this.state.selectedFilters.push(id)
    } else {
      this.state.selectedFilters.forEach((value, index) => {
        if (value === id) {
          this.state.selectedFilters.splice(index, 1)
        }
      })
    }

    this.state.tempmYarray[0] = this.state.price.lower
    this.state.tempmYarray[1] = this.state.price.upper
    this.state.tempmYarray2[0] = this.state.price.lower
    this.state.tempmYarray2[1] = this.state.price.upper
    this.props.navigation.setParams({
      tempmYarray: this.state.tempmYarray,
      tempmYarray2: this.state.tempmYarray2,
      applyFilter2: this.state.applyFilter
    })
  }

  /// /////////////////////////////
  selectedItem (id, key) {
    return (
      <TouchableOpacity
        key={key}
        style={[styles.selectedItemDesign, {
          backgroundColor: this.props.themeStyle.primaryBackgroundColor,
          borderColor: this.props.themeStyle.primary
        }]}
        onPress={() => {
          this.state.selectedFilters.forEach((value, index) => {
            if (value === id) {
              this.state.selectedFilters.splice(index, 1)
            }
          })
          this.applyFilters()
        }
        }
      >

        <Text
          numberOfLines={1}
          style={{
            fontSize: appTextStyle.smallSize - 1,
            color: this.props.themeStyle.primary,
            fontFamily: appTextStyle.fontFamily,
            width: '70%'
          }}>
          { this.getNameOfAtt(id)}
        </Text>
        <Ionicons
          name={'close-outline'}
          style={[styles.selectedItemIcon, {
            color: this.props.themeStyle.primary
          }]}
        />
      </TouchableOpacity>
    )
  }

  selectedItemSearch (name) {
    return (
      <TouchableOpacity
        key={1}
        style={[styles.selectedItemDesign, {
          backgroundColor: this.props.themeStyle.primaryBackgroundColor,
          borderColor: this.props.themeStyle.primary
        }]}
        onPress={() => {
          this.setState({ searchString: '', selectedTab: '', spinnerTemp: true, selectedCategory: '' }, () => {
            this.getProducts()
          })
        }}
      >

        <Text
          numberOfLines={1}
          style={{
            fontSize: appTextStyle.smallSize - 1,
            color: this.props.themeStyle.primary,
            fontFamily: appTextStyle.fontFamily,
            width: '70%'
          }}>
          {name }
        </Text>
        <Ionicons
          name={'close-outline'}
          style={[styles.selectedItemIcon, {
            color: this.props.themeStyle.primary
          }]}
        />
      </TouchableOpacity>
    )
  }

  /// /////////////////////////////
  singaleRow2 (a, v) {
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          padding: 5,
          marginHorizontal: 6,
          width: WIDTH * 0.15,
          marginBottom: 9,
          borderRadius: appTextStyle.customRadius - 15,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          borderColor: !this.state.selectedFilters.includes(v.id)
            ? this.props.themeStyle.iconPrimaryColor : this.props.themeStyle.primary
        }}
        onPress={() => {
          this.checkAttributeSelected(
            !this.state.selectedFilters.includes(v.id),
            v.id
          )
        }}>

        <Text
          numberOfLines={1}
          style={{
            fontSize: appTextStyle.smallSize - 1,
            fontFamily: appTextStyle.fontFamily,
            color: !this.state.selectedFilters.includes(v.id)
              ? this.props.themeStyle.textColor : this.props.themeStyle.primary
          }}>
          {v.detail[0].name}
        </Text>
        {this.state.selectedFilters.includes(v.id)
          ? <Ionicons
            name={'checkmark-outline'}
            style={{
              color: this.props.themeStyle.primary,
              fontSize: 8,
              position: 'absolute',
              right: 3

            }}
          /> : null}
      </TouchableOpacity>
    )
  }

  render () {
    const BUTTONS = this.state.sortArray
    const BUTTONS2 = this.state.sortArray2

    return this.state.activityIndicatorTemp ? (
      <View
        style={{ flex: 1, justifyContent: 'center', backgroundColor: this.props.themeStyle.secondryBackgroundColor }}>
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
      <View style={[styles.container, {
        backgroundColor: this.props.themeStyle.secondryBackgroundColor
      }]}>

        <View
          style={{
            alignItems: 'flex-start',
            flex: 1,
            backgroundColor: this.props.themeStyle.secondryBackgroundColor
          }}>
          <Spinner
            visible={this.state.spinnerTemp}
            textStyle={styles.spinnerTextStyle}
          />
          {/* //////////////DRawer///////// */}
          <Toast
            ref={ref => { this.toast = ref }}
            style={{ backgroundColor: this.props.themeStyle.iconPrimaryColor }}
            position='top'
            positionValue={400}
            fadeOutDuration={7000}
            textStyle={{ color: this.props.themeStyle.textColor, fontSize: appTextStyle.largeSize }}
          />
          <Modal
            animationType='fade'
            transparent={true}
            visible={this.state.modalVisibleSubCategory}
            onRequestClose={() => { this.setModalVisible(!this.state.modalVisibleSubCategory) }}
            style={{
              backgroundColor: this.props.themeStyle.secondryBackgroundColor,
              flex: 1
            }}>
            <TouchableWithoutFeedback onPress={() => this.setModalVisible(!this.state.modalVisibleSubCategory)}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setModalVisible(!this.state.modalVisibleSubCategory)
              }}
              style={{ flex: 1, backgroundColor: this.props.themeStyle.secondryBackgroundColor }}>
              <View
                style={[
                  styles.centeredView,
                  {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    top:
                      Platform.OS === 'ios' ? Height * 0.118 : Height * 0.117,
                    left: WIDTH * 0.01
                  }
                ]}>
                <ScrollView style={[styles.modalView, {
                  backgroundColor: this.props.themeStyle.secondryBackgroundColor
                }]}>
                  {this.state.allCategories.map((val, key) => (
                    <TouchableOpacity
                      key={key}
                      style={{
                        ...styles.modalText,
                        backgroundColor: this.props.themeStyle.backgroundColor,
                        padding: 8
                      }}
                      onPress={() =>
                        this.setState({
                          products: [],
                          tempApply: false,
                          isEmpty: false
                        }, () => {
                          if (this.props.language.All === val.name) {
                            this.state.selectedCategory = this.props.language.All
                            this.changeTab('')
                          } else {
                            this.state.selectedCategory = val.name

                            this.changeTab(val)
                          }
                          this.setModalVisible(
                            !this.state.modalVisibleSubCategory
                          )
                        })
                      }

                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.textStyle,
                          {
                            padding: 5,
                            textAlign: 'left',
                            fontFamily: appTextStyle.fontFamily,
                            color: this.props.themeStyle.textColor
                          }
                        ]}>
                        {val.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* ///////////////////////////////////////////////////////////////// */}
          <View style={{
            marginTop: -8,
            paddingBottom: 10,
            height: 45,
            width: WIDTH,
            marginBottom: 3,
            justifyContent: 'space-around'
          }}>
            <View
              style={[styles.bottomRow, {
                backgroundColor: this.props.themeStyle.primaryBackgroundColor
              }]}>

              <TouchableOpacity onPress={() => this.setModalVisible(true)} style={styles.headerComp}>
                <Text
                  style={[styles.sortText, {
                    color: this.props.themeStyle.textColor,
                    fontFamily: appTextStyle.fontFamily
                  }]}>
                  {
                    this.state.selectedCategory !== ''
                      ? this.state.selectedCategory
                      : this.props.language.Category}

                </Text>
                <Ionicons
                  name={'chevron-down-outline'}
                  style={{
                    color: this.props.themeStyle.textColor,
                    marginLeft: 5,
                    fontSize: 13
                  }}
                />
              </TouchableOpacity>

              <View style={{ backgroundColor: this.props.themeStyle.primaryBackgroundColor }}>

                <View>

                  <TouchableOpacity
                    style={[styles.picketTouch, {
                      backgroundColor: this.props.themeStyle.primaryBackgroundColor
                    }]}
                    onPress={() =>
                      ActionSheet.show(
                        {
                          options: BUTTONS,
                          cancelButtonIndex: CANCEL_INDEX
                        },
                        buttonIndex => {
                          if (buttonIndex === 0) {
                            this.getSortProducts('price')
                          } else if (buttonIndex === 1) {
                            this.getSortProducts('product_type')
                          } else if (buttonIndex === 2) {
                            this.getSortProducts('discount_price')
                          } else if (buttonIndex === 3) {
                            this.getSortProducts('product_status')
                          } else if (buttonIndex === 4) {
                            this.getSortProducts('product_view')
                          } else if (buttonIndex === 5) {
                            this.getSortProducts('seo_desc')
                          } else if (buttonIndex === 6) {
                            this.getSortProducts('created_at')
                          } else if (buttonIndex === 7) {
                            this.setState({ clicked: BUTTONS[buttonIndex], applyFilter: true })
                          }
                        }
                      )
                    }>
                    <View
                      style={styles.selectedSortText}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: appTextStyle.mediumSize,
                          fontFamily: appTextStyle.fontFamily,
                          color: this.props.themeStyle.textColor
                        }}
                        numberOfLines={1}>
                        {
                          this.props.language[this.state.indexTemp]
                        }
                      </Text>
                      <View>
                        <Ionicons
                          name={'chevron-down-outline'}
                          style={{
                            color: this.props.themeStyle.textColor,
                            marginLeft: 5,
                            fontSize: 13
                          }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {/* //des ase */}
              <View style={{ backgroundColor: this.props.themeStyle.primaryBackgroundColor }}>

                <View>
                  <TouchableOpacity
                    style={[styles.picketTouch, {
                      backgroundColor: this.props.themeStyle.primaryBackgroundColor
                    }]}
                    onPress={() =>
                      ActionSheet.show(
                        {
                          options: BUTTONS2,
                          cancelButtonIndex: CANCEL_INDEX
                        },
                        buttonIndex => {
                          if (buttonIndex === 0) {
                            this.getSortProducts2('ASC')
                          } else if (buttonIndex === 1) {
                            this.getSortProducts2('DESC')
                          } else if (buttonIndex === 2) {
                            this.setState({ clicked: BUTTONS2[buttonIndex], applyFilter: true })
                          }
                        }
                      )
                    }>
                    <View
                      style={styles.selectedSortText}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: appTextStyle.mediumSize,
                          fontFamily: appTextStyle.fontFamily,
                          color: this.props.themeStyle.textColor
                        }}
                        numberOfLines={1}>
                        {
                          this.props.language[
                            this.state.indexTemp2
                          ]
                        }
                      </Text>
                      <View>
                        <Ionicons
                          name={'chevron-down-outline'}
                          style={{
                            color: this.props.themeStyle.textColor,
                            marginLeft: 5,
                            fontSize: 13
                          }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  {/* )} */}
                </View>
              </View>

              <View
                style={{
                  borderColor: this.props.themeStyle.primaryBackgroundColor,
                  alignItems: 'center',
                  height: 44,
                  backgroundColor: this.props.themeStyle.primaryBackgroundColor,
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>

                {this.state.applyFilter ? (
                  <TouchableOpacity onPress={() => this.removeFilters()}>
                    <Icon
                      name={'md-refresh'}
                      size={10}
                      style={{
                        color: this.props.themeStyle.textColor,
                        marginRight: 15,
                        fontSize: 19
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => this.props.navigation.openDrawer()}>
                  <Text
                    style={[styles.sortText, {
                      fontFamily: appTextStyle.fontFamily,
                      color: this.props.themeStyle.textColor
                    }]}>
                    {this.props.language.Filter}

                  </Text>
                  <Ionicons
                    name={'funnel-outline'}
                    style={{
                      color: this.props.themeStyle.textColor,
                      marginRight: 9,
                      fontSize: 12
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

          </View>

          <View>

            {this.state.applyFilter
              ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>

                {this.state.selectedFilters.map((value, key) => (
                  this.selectedItem(
                    value, key
                  )
                ))}
              </View> : null}

            {this.state.searchString !== '' &&
            this.state.searchString !== undefined
              ? this.selectedItemSearch(
                this.state.searchString
              ) : null
            }
            { this.state.selectedTab !== '' &&
            this.state.selectedTab !== undefined
              ? this.selectedItemSearch(
                this.state.selectedCategory
              ) : null
            }
            <FlatListViewShop
              dataSource={this.state.products}
              products={this.props.language.Products}
              allCategories={this.props.allCategories}
              props={this.props}
              state={this.state}
              language={this.props.language}
              isEmpty={this.state.isEmpty}
              onRef={ref => (this.child = ref)}
              page={this.state.page}
              functionPropNameHere={() => this.getProducts()}
              sortArray={this.state.sortArray}
              productView={this.state.productView}
              applyFilter={this.state.tempApply}
            />
          </View>
          {/* /////////////////products///////////////////////// */}
        </View>

      </View>
    )
  }
}
/// ///////////////////////////////////////////////
const getLanguage = (state) => state.appConfig.languageJson
const getCategories = (state) => state.getCategories.categories
const getSettings = (state) => state.settingsCall.settings

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

const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
  }
)
const getTheme = (state) => state.appConfig.themeStyle
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)

const mapStateToProps = state => {
  return {
    themeStyle: getThemeFun(state),
    language: getLanguageFun(state),
    allCategories: getCategoriesFun(state),
    settings: getSettingsFun(state)

  }
}

/// //////////////////////////////////////////
export default connect(mapStateToProps, null)(withNavigation(Newest))
/// /////////////////////////////////////////////
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerComp: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  },
  bottomRow: {
    alignItems: 'center',
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowColor: '#000',
    shadowOpacity: 0,
    elevation: 0
  },
  modalText: {
    marginBottom: 0,
    textAlign: 'center'
  },
  modalView: {
    height: Height * 0.5,
    margin: 20,
    borderRadius: appTextStyle.customRadius - 15,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  sortText: {
    fontSize: appTextStyle.mediumSize,
    paddingBottom: 0,
    paddingLeft:
      Platform.OS === 'ios' ? 2 : I18nManager.isRTL ? 32 : 7,
    paddingRight:
      Platform.OS === 'ios' ? 2 : I18nManager.isRTL ? 8 : 13,
    textAlign:
      Platform.OS === 'ios'
        ? 'left'
        : !I18nManager.isRTL
          ? 'left'
          : 'right'
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  },
  picketStyle1: {
    paddingLeft: 1
  },
  picketTouch: {
    paddingTop: 2,
    paddingLeft: 3
  },
  selectedItemIcon: {
    fontSize: 10,
    position: 'absolute',
    right: 3
  },
  selectedItemDesign: {
    borderWidth: 1,
    padding: 5,
    width: 63,
    borderRadius: appTextStyle.customRadius - 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    margin: 8
  },
  selectedSortText: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    flexDirection: 'row'
  }
})
