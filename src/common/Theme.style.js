import { Dimensions } from 'react-native'
// import uuid from 'react-native-uuid'
const WIDTH = Dimensions.get('window').width
// set card width according to your requirement
const cardWidth = WIDTH * 0.3991

export default {
  url: 'https://e-mrcado.com',
  clientid: '6707134e16740434496f83f927',
  clientsecret: 'b3bc6e46167404344960506c11',
  oneSignalAppIdForAndroid: '54cbc922-59da-45b0-8156-8b8611efda7c',
  webClientIdForGoogleSign: '930506877678-bf26utnomcqku7smdtquau8e7aoftc5b.apps.googleusercontent.com',
  /// //// navigation

  // defaultLanguage: {
  //   lang: 'eng',
  //   isRtl: false
  // },
  // bottomNavigation: true,
  // // please reset app cache after changing these five values
  // defaultCurrencySymbol: '&#36;',
  // defaultCurrencyCode: 'USD',
  // priceDecimals: 2,
  // // by default language for ltr
  // ltrlanguageCode: 'en',
  // // by default language for rtl
  // rtllanguageCode: 'ar',

  // Banners props
  autoplay: true,
  autoplayDelay: 2,
  autoplayLoop: true,
  appInProduction: true,
  // StatusBarColor: '#374e02',
  // --ion-color-primary-shade: #374e02;

  // headerTintColor: 'rgb(255, 255, 255)',
  // headerIconsColor: 'rgb(255, 255, 255)',

  // primaryDark: '#374e02',
  // primary: '#3e5902',
  // primaryContrast: '#ffffff',
  // // backgroundColor: '#F2F2F2',// color for card style 11
  // // backgroundColor: '#fdfcfa',
  // backgroundColor: '#fdfdfd',
  // textColor: '#000',
  // textContrast: '#000',

  // google: '#dd4b39',
  // facebook: '#3b5998',

  // // Button Colors
  // addToCartBtnColor: '#3e5902',
  // addToCartBtnTextColor: '#fff',
  // // addToCartBagBtnColor: '#4E4E4E',
  // addToCartBagBtnColor: '#3e5902',

  // outOfStockBtnColor: '#D81800',
  // outOfStockBtnTextColor: '#fff',

  // detailsBtnColor: '#3e5902',
  // detailsBtnTextColor: '#fff',
  // removeBtnColor: '#D81800',
  // removeBtnTextColor: '#fff',
  // wishHeartBtnColor: '#3e5902',
  // otherBtnsColor: '#3e5902',
  // otherBtnsText: '#fff',

  // saleBackgroundColor: '#3e5902',
  // saleTextColor: '#fff',
  // featuredBackgroundColor: '#3e5902',
  // featuredTextColor: '#fff',
  // newBackgroundColor: '#D81800',
  // newTextColor: '#fff',

  // priceColor: '#000',

  // /// ///////// font size

  // largeSize: 16,
  // mediumSize: 14,
  // smallSize: 12,

  /// //////// cartWidth
  singleRowCardWidth: cardWidth,
  twoRowCardWIdth: 0.465,
  // loadingIndicatorColor: '#3e5902',

  barStyle: 'light-content' // dark-content, default
  // ipAdress: cIp,
  // deviceId: cDid
}

export const appTextStyle = {
  smallSize: 11,
  mediumSize: 12,
  largeSize: 14,
  customRadius: 19,
  fontFamily: 'Montserrat-Regular',
  isDarkMode: false,
  homeTitle: ''
}

export const appConfigStyle = { // dont change its value on run time
  // homeTitle should be empty for namal icon
  cardsColor: false,
  settingsPageColor: false,
  headerMenuImage: true,
  headerSearchBar: false,
  headerColor: true,
  introStyle: 2,
  bottomNavText: false,
  homeTitle: 'Mrcado'
}

export const appLightTheme = {
  name: 'light',
  StatusBarColor: '#feae00',
  barStyle: 'light-content',
  primary: '#feae00',
  secondry: '#1c1c1e',
  primaryLight: '#f1f3f2',
  // primaryBackgroundColor: '#ffffff',
  // secondryBackgroundColor: '#ffffff', // backgroundcolor black
  primaryBackgroundColor: '#ffffff',
  secondryBackgroundColor: '#f1f1f1', // backgroundcolor black
  textColor: '#444444',
  cardTextColor: appConfigStyle.cardsColor ? '#000000' : '#444444',
  textTintColor: '#ffffff',
  iconPrimaryColor: '#9ba5a7',
  iconSecondryColor: '#000000'
}
export const appDarkTheme = {
  name: 'dark',
  StatusBarColor: '#1c1c1e',
  barStyle: 'light-content',
  primary: '#1c1c1e',
  primaryLight: '#f1f3f2',
  secondry: '#feae00',
  cardTextColor: appConfigStyle.cardsColor ? '#000000' : '#ffffff',
  // primaryBackgroundColor: '#252525', //
  // secondryBackgroundColor: '#414141', // backgroundcolor white
  primaryBackgroundColor: '#fff', //
  secondryBackgroundColor: '#fff', // backgroundcolor white
  textColor: '#000',
  textTintColor: '#ffffff',
  iconPrimaryColor: '#9ba5a7',
  iconSecondryColor: '#ffffff'
}

// export const appLightTheme = {
//   StatusBarColor: '#47a9ff',
//   barStyle: 'light-content',
//   primary: '#47a9ff',
//   secondry: '#ffc854',
//   primaryLight: '#f1f3f2',
//   primaryBackgroundColor: '#ffffff',
//   secondryBackgroundColor: '#ffffff', // backgroundcolor black
//   textColor: '#444444',
//   cardTextColor: '#000000',
//   textTintColor: '#ffffff',
//   iconPrimaryColor: '#9ba5a7',
//   iconSecondryColor: '#000000'
// }
// export const appDarkTheme = {
//   StatusBarColor: '#47a9ff',
//   barStyle: 'light-content',
//   primary: '#47a9ff',
//   primaryLight: '#f1f3f2',
//   secondry: '#ffc854',
//   cardTextColor: '#000000',
//   primaryBackgroundColor: '#252525', //
//   secondryBackgroundColor: '#252525', // backgroundcolor white
//   textColor: '#ffffff',
//   textTintColor: '#ffffff',
//   iconPrimaryColor: '#9ba5a7',
//   iconSecondryColor: '#ffffff'
// }
