import React, { useState } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  TextInput
} from 'react-native'
import { useSelector } from 'react-redux'
import themeStyle from '../common/Theme.style'

const CardScreen = ({ navigation }) => {
  const [transType, setTransType] = useState('USE')

  const changeTransType = value => {
    setTransType(value)
  }

  return (
    <View style={[styles.flexColumn, styles.container]}>
      <View style={[styles.flexRow, styles.borderShadow, styles.bgLight, { paddingHorizontal: 10, height: 80, marginBottom: 10 }]}>
        <View style={styles.flexRow}>
          <Image source={require('../images/newImages/card_yellow.png')} style={styles.img} />
          <Text style={[styles.styleTxt, { fontSize: 20, fontWeight: '700' }]}>Recharge & Manage Cards</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.flexRow, styles.borderShadow, styles.bgDark, styles.mainItem, transType === 'MANAGE' && styles.activeBorder]}
        onPress={() => changeTransType('MANAGE')}
      >
        <Text style={styles.styleTxt}>Manage Card</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.flexRow, styles.borderShadow, styles.bgDark, styles.mainItem, transType === 'USE' && styles.activeBorder]}
        onPress={() => changeTransType('USE')}
      >
        <Text style={styles.styleTxt}>Use the digital card(Code - Voucher - Gift Card)</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }}></View>

      <View style={[styles.flexRow, styles.borderShadow, styles.bgLight, styles.mainItem, { justifyContent: 'space-around', paddingHorizontal: 30 }]}>
        <TextInput placeholder='Insert Digital Card Number' />
      </View>

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

export default CardScreen
