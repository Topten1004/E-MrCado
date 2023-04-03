import React, { useState } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet
} from 'react-native'
import { useSelector } from 'react-redux'
import themeStyle from '../common/Theme.style'

const PayTransferScreen = ({ navigation }) => {
  const [transType, setTransType] = useState('PTM')

  const changeTransType = value => {
    setTransType(value)
  }

  return (
    <View style={[styles.flexColumn, styles.container]}>
      <View style={[styles.flexRow, styles.borderShadow, styles.bgLight, { paddingHorizontal: 10, height: 80, marginBottom: 10 }]}>
        <View style={styles.flexRow}>
          <Image source={require('../images/newImages/pay_transfer_yellow.png')} style={styles.img} />
          <Text style={[styles.styleTxt, { fontSize: 24, fontWeight: '700' }]}>Pay & Transfer</Text>
        </View>
        <Image source={require('../images/next_dark.png')} />
      </View>
      <TouchableOpacity
        style={[styles.flexRow, styles.borderShadow, styles.bgDark, styles.mainItem, transType === 'PTM' && styles.activeBorder]}
        onPress={() => changeTransType('PTM')}
      >
        <Text style={styles.styleTxt}>Transfer Point to Money in Your Digital Card</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.flexRow, styles.borderShadow, styles.bgDark, styles.mainItem, transType === 'MTP' && styles.activeBorder]}
        onPress={() => changeTransType('MTP')}
      >
        <Text style={styles.styleTxt}>Transfer Money to Point in Your Digital Card</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }}></View>

      <View style={[styles.flexRow, styles.borderShadow, styles.bgDark, styles.mainItem, { justifyContent: 'space-around', paddingHorizontal: 30 }]}>
        <Text style={styles.styleTxt}>POINT|864</Text>
        <Text style={styles.styleTxt}>=</Text>
        <Text style={styles.styleTxt}>KWD|8.30</Text>
      </View>

      {transType === 'PTM' &&
        <View>
          <View style={styles.flexRow}>
            <View style={[styles.borderShadow, styles.calItem, styles.bgDark, styles.flexRow]}>
              <Text style={styles.styleTxt}>Point</Text>
            </View>
            <View style={[styles.borderShadow, styles.calItem, styles.bgLight, styles.flexRow]}>
              <Text style={styles.styleTxt}>0</Text>
            </View>
            <TouchableOpacity style={[styles.borderShadow, styles.calItem, styles.bgYellow, styles.flexRow]}>
              <Text style={styles.styleTxt}>Calculate</Text>
            </TouchableOpacity>
            <View style={[styles.borderShadow, styles.calItem, styles.bgDark, styles.flexRow]}>
              <Text style={styles.styleTxt}>KWD</Text>
            </View>
            <View style={[styles.borderShadow, styles.calItem, styles.bgLight, styles.flexRow, { marginRight: 0 }]}>
              <Text style={styles.styleTxt}>0</Text>
            </View>
          </View>
          <View style={[styles.flexRow, styles.borderShadow, styles.bgDark, styles.mainItem, { justifyContent: 'space-around', paddingHorizontal: 5 }]}>
            <Text style={styles.styleTxt}>Remaining Point|864</Text>
            <Text style={styles.styleTxt}>=</Text>
            <Text style={styles.styleTxt}>KWD|12</Text>
          </View>
        </View>
      }
      {transType === 'MTP' &&
        <View>
          <View style={styles.flexRow}>
            <View style={[styles.borderShadow, styles.calItem, styles.bgDark, styles.flexRow]}>
              <Text style={styles.styleTxt}>KWD</Text>
            </View>
            <View style={[styles.borderShadow, styles.calItem, styles.bgLight, styles.flexRow]}>
              <Text style={styles.styleTxt}>0</Text>
            </View>
            <TouchableOpacity style={[styles.borderShadow, styles.calItem, styles.bgYellow, styles.flexRow]}>
              <Text style={styles.styleTxt}>Calculate</Text>
            </TouchableOpacity>
            <View style={[styles.borderShadow, styles.calItem, styles.bgDark, styles.flexRow]}>
              <Text style={styles.styleTxt}>Point</Text>
            </View>
            <View style={[styles.borderShadow, styles.calItem, styles.bgLight, styles.flexRow, { marginRight: 0 }]}>
              <Text style={styles.styleTxt}>0</Text>
            </View>
          </View>
          <View style={[styles.flexRow, styles.borderShadow, styles.bgDark, styles.mainItem, { justifyContent: 'space-around', paddingHorizontal: 5 }]}>
            <Text style={styles.styleTxt}>Your Balance KWD|12</Text>
            <Text style={styles.styleTxt}>=</Text>
            <Text style={styles.styleTxt}>Point|864</Text>
          </View>
        </View>
      }

      <View style={[styles.flexRow, { justifyContent: 'center', marginTop: 40 }]}>
        <TouchableOpacity style={[styles.bgYellow, styles.flexRow, styles.borderShadow, { width: 250, height: 70, justifyContent: 'center' }]}>
          <Text style={{ fontSize: 30, color: 'white', fontWeight: '700' }}>CONFIRM</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  mainItem: {
    marginVertical: 5,
    height: 60,
    justifyContent: 'center'
  },
  calItem: {
    marginVertical: 5,
    height: 60,
    justifyContent: 'center',
    padding: 15,
    marginRight: 5
  },
  activeBorder: {
    borderWidth: 1,
    borderColor: 'darkgoldenrod'
  },

  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    fontSize: 16,
    color: 'black',
    textAlign: 'center'
  },

  bgDark: {
    backgroundColor: 'lightgray'
  },
  bgLight: {
    backgroundColor: 'white'
  },
  bgYellow: {
    backgroundColor: '#fcc922'
  },
  img: {
    width: 60,
    height: 60,
    marginRight: 10
  }
})

export default PayTransferScreen
