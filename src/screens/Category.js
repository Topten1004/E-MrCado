import React, { PureComponent } from 'react'
import Category1Screen from './Category1Screen'
import Category2Screen from './Category2Screen'
import Category3Screen from './Category3Screen'
import Category4Screen from './Category4Screen'
import Category5Screen from './Category5Screen'
import Category6Screen from './Category6Screen'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'

class Category extends PureComponent {
  componentDidMount () {
    this.props.navigation.setParams({
      headerTitle: this.props.language.Category,
      colorProps: this.props.themeStyle.primaryBackgroundColor,
      iconColor: this.props.themeStyle.textColor
    })
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return this.props.settings.category_style === '1' ? (
      <Category2Screen navigation={this.props.navigation} />
    ) : this.props.settings.category_style === '2' ? (
      <Category3Screen navigation={this.props.navigation} />
    ) : this.props.settings.category_style === '3' ? (
      <Category5Screen navigation={this.props.navigation} />
    ) : this.props.settings.category_style === '4' ? (
      <Category4Screen navigation={this.props.navigation} />
    ) : this.props.settings.category_style === '5' ? (
      <Category1Screen navigation={this.props.navigation} />
    ) : this.props.settings.category_style === '6' ? (
      <Category6Screen navigation={this.props.navigation} />
    ) : (
      <Category1Screen navigation={this.props.navigation} />
    )
  }
}
const getSettings = (state) => state.settingsCall.settings
const getSettingsFun = createSelector(
  [getSettings],
  (getSettings) => {
    return getSettings
  }
)

const getLanguage = (state) => state.appConfig.languageJson
const getTheme = (state) => state.appConfig.themeStyle
const getThemeFun = createSelector(
  [getTheme],
  (getTheme) => {
    return getTheme
  }
)
const getLanguageFun = createSelector(
  [getLanguage],
  (getLanguage) => {
    return getLanguage
  }
)
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  language: getLanguageFun(state),
  settings: getSettingsFun(state)

})
export default connect(mapStateToProps, null)(Category)
