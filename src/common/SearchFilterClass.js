import React, { Component } from 'react'
import { Text, StyleSheet, View, FlatList, TextInput } from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import { appTextStyle } from './Theme.style'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

class MyProject extends Component {
  static navigationOptions = ({ navigation }) => {
    const headerStyle = navigation.getParam('headerTitle')
    const colorProps = navigation.getParam('colorProps')
    const iconColor = navigation.getParam('iconColor')
    return {
      headerTitle: headerStyle,
      headerForceInset: { top: 'never', vertical: 'never' },
      headerStyle: {
        backgroundColor: colorProps
      },
      headerTintColor: iconColor,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: appTextStyle.largeSize + 2
      },
      headerTitleAlign: 'center'
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      text: '',
      arrayholder: []
    }
  }

  componentDidMount () {
    this.setState(
      {
        isLoading: false,
        dataSource: this.props.navigation.state.params.data
      },
      function () {
        this.setState({ arrayholder: this.props.navigation.state.params.data })
      }
    )
    this.props.navigation.setParams({
      headerTitle: this.props.language.Search,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  GetListViewItem (name) {
    this.setState({ text: name.country_name })
    this.props.navigation.state.params.onGoBack(
      name,
      this.props.navigation.state.params.onSelectionBase
    )
    this.props.navigation.goBack()
  }

  SearchFilterFunction (text) {
    const newData = this.state.arrayholder.filter(item => {
      const itemData = item.country_name.toUpperCase()
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })
    this.setState({
      dataSource: newData,
      text
    })
  }

  ListViewItemSeparator = () => (
    <View
      style={{
        height: 0.5,
        width: '100%',
        backgroundColor: this.props.themeStyle.secondryBackgroundColor
      }}
    />
  )

  render () {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, paddingTop: 20, color: this.props.themeStyle.iconPrimaryColor }}>
          <UIActivityIndicator color={this.props.themeStyle.iconPrimaryColor} size={27} />
        </View>
      )
    }
    return (
      <View style={[styles.MainContainer, {
        backgroundColor: this.props.themeStyle.primaryBackgroundColor

      }]}>
        <TextInput
          style={{
            textAlign: 'center',
            height: 40,
            borderWidth: 1,
            borderColor: this.props.themeStyle.primary,
            borderRadius: 7,
            color: this.props.themeStyle.textColor,
            backgroundColor: this.props.themeStyle.primaryBackgroundColor
          }}
          placeholderTextColor={'#c0c0c0'}
          onChangeText={text => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid='transparent'
          placeholder='Search Here'
        />

        <FlatList
          data={this.state.dataSource}
          showsVerticalScrollIndicator={false}
          renderSeparator={this.ListViewItemSeparator}
          renderItem={({ item }) => (
            <Text
              style={[styles.rowViewContainer, {
                color: this.props.themeStyle.textColor

              }]}
              onPress={this.GetListViewItem.bind(this, item)}>
              {item.country_name}
            </Text>
          )}
          enableEmptySections
          style={{ marginTop: 10 }}
        />
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
const getLanguage = (state) => state.appConfig.languageJson
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state)
})

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    padding: 7
  },
  rowViewContainer: {
    fontSize: 17,
    padding: 10
  }
})

export default connect(mapStateToProps, null)(MyProject)
