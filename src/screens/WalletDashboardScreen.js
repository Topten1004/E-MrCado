import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native'
import { useSelector } from 'react-redux'
import themeStyle from '../common/Theme.style'

const WalletDashboardScreen = ({ navigation }) => {
  const language = useSelector(state => state.appConfig.languageJson)
  return (
    <View style={{ flex: 1, backgroundColor: themeStyle.primaryBackgroundColor }}>
      <View style={{ padding: 20 }}>
        <Text style={{ color: 'black', fontSize: 22, fontWeight: 'bold' }}>Wallet</Text>
        <View>
          <Image style={{ width: '135%', height: 250, resizeMode: 'cover', alignSelf: 'center' }} source={require('../images/newImages/card_black.png')}/>
          <Text style={{ position: 'absolute', color: 'gold', fontSize: 22, paddingLeft: '50%', top: 30 }}>KWD 0</Text>
          <Text style={{ position: 'absolute', color: 'orange', fontSize: 11, paddingLeft: '50%', top: 60 }}>WALLET / OR BALANCE</Text>
        </View>
        <TouchableOpacity
          key={0}
          style={{}}
          onPress={() => {}}
        >
          <View style={{ shadowRadius: 5, shadowColor: 'balck', shadowOffset: 2, flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: 'white', paddingHorizontal: 10, height: 70 }}>
            <Image style={{ width: 50, height: 50, marginRight: 10 }} source={require('../images/newImages/profile_yellow.png')} />
            <Text style={{ fontSize: 22, color: 'black', alignSelf: 'center', fontWeight: 'bold' }}>Point</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          key={1}
          style={{}}
          onPress={() => navigation.navigate('PayTransferScreen')}
        >
          <View key={1} style={{ shadowRadius: 5, shadowColor: 'balck', shadowOffset: 2, flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: 'white', paddingHorizontal: 10, height: 70 }}>
            <Image style={{ width: 50, height: 50, marginRight: 10 }} source={require('../images/newImages/pay_transfer_yellow.png')} />
            <Text style={{ fontSize: 22, color: 'black', alignSelf: 'center', fontWeight: 'bold' }}>Pay & Transfer</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          key={2}
          style={{}}
          onPress={() => navigation.navigate('CardScreen')}
        >
          <View key={2} style={{ shadowRadius: 5, shadowColor: 'balck', shadowOffset: 2, flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: 'white', paddingHorizontal: 10, height: 70 }}>
            <Image style={{ width: 50, height: 50, marginRight: 10 }} source={require('../images/newImages/card_yellow.png')} />
            <Text style={{ fontSize: 22, color: 'black', alignSelf: 'center', fontWeight: 'bold' }}>Recharge & Manage Cards</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          key={3}
          style={{}}
          onPress={() => {}}
        >
          <View key={3} style={{ shadowRadius: 5, shadowColor: 'balck', shadowOffset: 2, flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: 'white', paddingHorizontal: 10, height: 70 }}>
            <Image style={{ width: 50, height: 50, marginRight: 10 }} source={require('../images/newImages/timeline_yellow.png')} />
            <Text style={{ fontSize: 22, color: 'black', alignSelf: 'center', fontWeight: 'bold' }}>QR Code</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default WalletDashboardScreen
