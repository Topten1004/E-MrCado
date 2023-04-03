import React, { PureComponent } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SwiperFlatList from 'react-native-swiper-flatlist'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import Header from '../common/HeaderCustom'
import markedIcon from '../images/rate_marked.png'
import unmarkedIcon from '../images/rate_unmarked.png'

class ProductDetailScreen extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      title: 'SAFLON GRANITE POT WITH STEEL LID',
      imgLink: require('../images/granite_pot.png'),
      subtitle: 'Saflon Granite Pot With Steel Lid',
      price: 10.99,
      kind: 'GSA016',
      smallImageList: [
        require('../images/granite_pot.png'),
        require('../images/granite_pot.png')
      ],
      delivery: 'Delivery On Tuesday, January 1.',
      description: 'Saflon Product Made From Pure 4.00MM Aluminum Discs, 99% AI. And 1% Mixed Of (Nickle, Cupper, Chrome And Gold)\nNon-stick for healthy cooking and easy to clean\nFor great cook and elegant, classic and save serving\nCooking with little oil for healty diet\nBottom provides a stable heat distribution and rapidly heating up, saves time and energy\nSuitable for gas, ceramic, electric, halogen or inducting oven',
      reviews: [
        { avatar: '', name: 'Terrence Balfour', rate: 0, comments: 'AAAAAAAAAAAAAAAAAAAAAA' },
        { avatar: '', name: 'Terrence Balfour', rate: 3, comments: 'AAAAAAAAAAAAAAAAAAAAAA' }
      ],
      relatedProducts: [],

      sizeList: [12, 14, 18, 20, 22, 24, 26, 28, 30, 32, 35, 37, 40, 45],
      quantity: 0
    }
  }

  handleSetQuantity (value) {
    if (value >= 0) {
      this.setState(state => ({
        ...state,
        quantity: value
      }))
    }
  }

  render () {
    return (
      <View
        style={{
          backgroundColor: this.props.themeStyle.secondryBackgroundColor,
          flex: 1
        }}
      >
        <ScrollView style={styles.container}>
          <Text>Kitchen/Cookingwear/</Text>
          <Text style={styles.title}>{this.state.title}</Text>
          <View style={styles.productImages}>
            <SwiperFlatList
              index={0}
              showPagination
              paginationDefaultColor={'rgba(0,0,0,0.2)'}
              paginationActiveColor={this.props.themeStyle.primaryBackground}
              paginationStyleItem={{
                width: 10,
                height: 10,
                marginLeft: 3,
                marginRight: 3,
                marginBottom: -25
              }}>
              {Array(4).fill(0).map((item, index) => {
                return <Image
                  placeholder={false}
                  key={index}
                  style={styles.productImg}
                  resizeMode={'cover'}
                  source={this.state.imgLink}
                />
              })}
            </SwiperFlatList>
          </View>
          <Text style={styles.subtitle}>{this.state.subtitle}</Text>
          <Text style={styles.subtitle}>As low as KWD {this.state.price}</Text>
          <Text style={styles.subtitle}>In Stock</Text>
          <Text style={styles.subtitle}>SKU {this.state.kind}</Text>
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.subtitle, { marginBottom: 5 }]}>Color</Text>
            <View style={styles.smallContainer}>
              {this.state.smallImageList.map((item, index) => (
                <View key={index} style={[styles.smallImageItem, styles.borderShadow, { backgroundColor: this.props.themeStyle.secondryBackgroundColor }]}>
                  <Image source={item} style={styles.smallImage} />
                </View>
              ))}
            </View>
          </View>
          <View>
            <Text style={[styles.subtitle, { marginBottom: 5, marginTop: 10 }]}>Size</Text>
            <View style={styles.sizeContainer}>
              {this.state.sizeList.map((item, index) => (
                <View key={index} style={[styles.sizeItem, styles.borderShadow, { backgroundColor: this.props.themeStyle.secondryBackgroundColor }]}>
                  <Text style={styles.sizeText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.quantity}>
            <TouchableOpacity style={styles.quantityBtn} onPress={() => this.handleSetQuantity(this.state.quantity - 1)}><Text style={[styles.quantityBtnTxt, { fontSize: 120, marginTop: 60 }]}>-</Text></TouchableOpacity>
            <Text style={[styles.quantityText, { marginTop: -5 }]}>{this.state.quantity}</Text>
            <TouchableOpacity style={styles.quantityBtn} onPress={() => this.handleSetQuantity(this.state.quantity + 1)}><Text style={[styles.quantityBtnTxt, { marginTop: 15 }]}>+</Text></TouchableOpacity>
          </View>
          <View style={[styles.delivery, styles.borderShadow, { backgroundColor: this.props.themeStyle.secondryBackgroundColor }]}>
            <Text style={styles.content}>{this.state.delivery}</Text>
          </View>
          <View style={[styles.description, styles.borderShadow, { backgroundColor: this.props.themeStyle.secondryBackgroundColor }]}>
            <Text style={styles.title}>Product Description</Text>
            <Text style={styles.content}>{this.state.description}</Text>
          </View>
          <View style={[styles.reviewContainer, styles.borderShadow, { backgroundColor: this.props.themeStyle.secondryBackgroundColor }]}>
            <Text style={styles.title}>Custom Review</Text>
            {this.state.reviews.map((item, index) => (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.flexRow}>
                    <Image source={require('../images/avatar.png')} style={styles.reviewAvatar} />
                    <Text>{item.name}</Text>
                  </View>
                  <View style={styles.flexRow}>
                    {Array(5).fill(0).map((rateItem, index) => {
                      if (index < item.rate) {
                        return <Image key={index} source={markedIcon} style={styles.reviewRate} />
                      } else {
                        return <Image key={index} source={unmarkedIcon} style={styles.reviewRate} />
                      }
                    })}
                  </View>
                </View>
                <Text style={styles.content}>{item.comments}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.title}>Related Product</Text>
          <ScrollView horizontal={true}>
            {Array(10).fill(0).map((item, index) => (
              <View key={index + 100} style={{ paddingBottom: 10, paddingLeft: 1 }}>
                <View style={[styles.borderShadow, { width: 150, height: 250, justifyContent: 'center', marginRight: 10, backgroundColor: this.props.themeStyle.secondryBackgroundColor }]}>
                  <Text style={{ alignItems: 'center', textAlign: 'center' }}>{index}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={[styles.flexRow]}>
            <TouchableOpacity style={[styles.borderShadow, styles.flexRow, styles.actionBtn, styles.cartBtn]}>
              <Text style={styles.actionBtnText}>Add To Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.borderShadow, styles.flexRow, styles.actionBtn, styles.buyBtn]}>
              <Text style={styles.actionBtnText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 50 }}></View>
        </ScrollView>
      </View>
    )
  }
}

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

const mapDispatchToProps = dispatch => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetailScreen)

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 40,
    width: '100%'
  },
  productImages: {
    marginBottom: 30
  },
  productImg: {
    width: 350,
    height: 250,
    padding: 20
  },

  smallContainer: { display: 'flex', flexDirection: 'row' },
  smallImageItem: {
    padding: 10,
    margin: 1,
    marginLeft: 1,
    marginRight: 20
  },
  smallImage: { width: 60, height: 60 },

  sizeContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  sizeItem: {
    width: 45,
    height: 45,
    margin: 0,
    marginLeft: 1,
    marginRight: 4,
    marginBottom: 5,
    display: 'flex',
    justifyContent: 'center'
  },
  sizeText: {
    fontSize: 20,
    textAlign: 'center'
  },

  quantity: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#404040',
    width: '50%',
    height: 50,
    marginVertical: 20
  },
  quantityBtn: {
    color: 'white',
    width: '40%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  quantityBtnTxt: {
    color: 'white',
    fontSize: 60,
    fontWeight: '600',
    width: 40
  },
  quantityText: {
    fontSize: 30,
    color: 'white'
  },

  delivery: {
    height: 100,
    margin: 1,
    marginBottom: 10,
    padding: 10
  },

  description: {
    // height: 300,
    margin: 1,
    marginBottom: 10,
    padding: 10
  },

  reviewContainer: {
    // height: 100,
    margin: 1,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    padding: 10
  },
  reviewItem: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20
  },
  reviewHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reviewAvatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginRight: 10
  },
  reviewRate: {
    width: 15,
    height: 15,
    marginRight: 10
  },

  actionBtn: {
    width: '45%',
    height: 40,
    justifyContent: 'center'
  },
  cartBtn: {
    backgroundColor: 'lightgray'
  },
  buyBtn: {
    backgroundColor: 'gray'
  },
  actionBtnText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600'
  },

  borderShadow: {
    elevation: 5,
    shadowColor: '#52006A'
  },
  title: {
    fontWeight: '700',
    color: 'black',
    marginBottom: 20
  },
  subtitle: {
    fontWeight: '600',
    color: 'black',
    fontSize: 16
  },
  content: {
    fontSize: 16,
    fontWeight: '400',
    color: 'black'
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
