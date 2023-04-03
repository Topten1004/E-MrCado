import React, { PureComponent } from 'react'
import {
  TextInput, // Renders text
  TouchableOpacity, // Pressable container
  View,
  Dimensions,
  I18nManager,
  Platform,
  Text,
  StyleSheet
} from 'react-native'
import { appTextStyle } from '../common/Theme.style'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createSelector } from 'reselect'
const WIDTH = Dimensions.get('window').width
class Header extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      searchString: ''
    }
  }

  render ({
    language, searchString, setSearchState, onSearchPress,
    addSearchData, notEditable, th
  } = this.props) {
    return (
      <TouchableOpacity
        onPress={() => notEditable ? this.props.navigation.navigate('SearchScreen') : null}
        style={[styles.headerView]}>

        <TouchableOpacity
          onPress={() => notEditable ? this.props.navigation.navigate('SearchScreen') : null}
          style={[styles.innerView]}>
          <Ionicons
            name={'search'}
            style={[styles.iconStyle, {
              color: '#b1b1b1'
            }]}
          />
          <TextInput
            onPress={() => notEditable ? this.props.navigation.navigate('SearchScreen') : null}

            editable={!notEditable}
            placeholder='Search'
            returnKeyType={'search'}
            onSubmitEditing={() => {
              addSearchData(searchString, th)
              onSearchPress(searchString)
            }}
            style={[styles.textinputStyle, {
              fontSize: appTextStyle.largeSize,
              color: this.props.themeStyle.textColor,
              backgroundColor: '#f6f6f6'
            }]}
            placeholderTextColor={'#bdbdbd'}
            selectionColor={this.props.themeStyle.iconPrimaryColor}
            placeholder={language['Search what would you like to buy']}
            onChangeText={searchString =>
              setSearchState(searchString)
            }
            value={searchString}
          />

        </TouchableOpacity>

      </TouchableOpacity>
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
export default connect(mapStateToProps, null)(Header)
const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: '0.5%',
    paddingBottom: '0.5%',
    paddingHorizontal: 12,
    width: '92%',
    alignSelf: 'center',
    margin: 1,
    marginTop: 7,
    borderRadius: 16,
    backgroundColor: '#f6f6f6'
  },
  iconStyle: {
    fontSize: 22,
    paddingRight: 6
  },
  textinputStyle: {
    width: WIDTH * 0.75,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 5
  },
  cancelText: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: WIDTH * 0.9,
    padding: Platform.OS === 'ios' ? 10 : 2,
    backgroundColor: '#f6f6f6',
    borderRadius: 16
  }
})
