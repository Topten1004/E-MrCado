import React, { Component } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SwiperFlatList from 'react-native-swiper-flatlist'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

class ProductItem extends Component {
  render ({
    navigation,
    header,
    imgLink,
    title,
    priceOld,
    priceCurrent,
    favorite,
    smallImageList,
    time
  } = this.props) {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2, paddingVertical: 2, height: 20 }}>
          <View style={{ width: 55, height: 20, backgroundColor: 'red', justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 10 }}>{header.rate}%</Text>
          </View>
          <View style={{ width: 55, height: 20, backgroundColor: 'orange', justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 10 }}>{header.option1}</Text>
          </View>
          <View style={{ width: 55, height: 20, backgroundColor: 'black', justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 10 }}>{header.option2}</Text>
          </View>
        </View>
        <View style={{ height: 130 }}>
          <SwiperFlatList
            index={0}
            showPagination
            paginationDefaultColor={'rgba(0,0,0,0.2)'}
            paginationActiveColor={this.props.themeStyle.primaryBackground}
            paginationStyleItem={{
              width: 8,
              height: 8,
              marginLeft: 3,
              marginRight: 3,
              marginBottom: -5
            }}>
            {Array(4).fill(0).map((item, index) => {
              return <Image
                placeholder={false}
                key={index}
                style={{ width: 160, height: 120 }}
                resizeMode={'cover'}
                source={imgLink}
              />
            })}
          </SwiperFlatList>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ color: 'black' }}>{title}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ textDecorationLine: 'line-through' }}>KWD {priceOld}</Text>
            <FontAwesome
              name={'heart'}
              style={{ color: 'gray', fontSize: 15 }}
            />
          </View>
          <Text style={{ color: 'red' }}>KWD {priceCurrent}</Text>
          <View style={{ flexDirection: 'row', marginBottom: 2 }}>
            {smallImageList.map((item, index) => (
              <View key={index} style={styles.smallImageItem}>
                <Image style={styles.smallImage} source={item} />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>Day</Text>
              <Text style={styles.timeText}>{time.days}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>Hrs</Text>
              <Text style={styles.timeText}>{time.hrs}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>Min</Text>
              <Text style={styles.timeText}>{time.mins}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeText}>Sec</Text>
              <Text style={styles.timeText}>{time.seconds}</Text>
            </View>
          </View>
          {/* <TouchableOpacity style={styles.cartBtn} onPress={() => this.handleAddCart()}> */}
          {/* <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('ProductDetailScreen')}> */}
          <TouchableOpacity style={styles.cartBtn} onPress={() => console.log('Add to cart')}>
            <Text style={styles.cartBtnText}>Add To Cart</Text>
          </TouchableOpacity>
        </View>
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
  // handleAddCart: this.props.handleAddCart(),
  // handleAddCart: () => {
  //     this.props.handleAddCart()
  // }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductItem)

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 320,
    borderWidth: 1,
    margin: 5
  },

  timeItem: {
    width: 22,
    height: 22,
    backgroundColor: 'black',
    marginRight: 2
  },
  timeText: {
    fontSize: 8,
    color: 'white'
  },

  smallImageItem: { borderWidth: 1, marginRight: 2 },
  smallImage: { width: 20, height: 20 },

  cartBtn: {
    width: '100%',
    backgroundColor: 'orange',
    alignSelf: 'center',
    height: 25,
    justifyContent: 'center',
    marginTop: 5
  },
  cartBtnText: {
    textAlign: 'center',
    color: 'white'
  }
})
