import React, { PureComponent } from 'react'
import { View, FlatList } from 'react-native'
import { UIActivityIndicator } from 'react-native-indicators'
import Category5Style from './Categories5'
import theme from './Theme.style'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
class FlatListView extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      newData: []
    }
  }

  openSubCategories = (parent, name) => {
    for (const val of this.props.allCategories) {
      if (val.parent === parent) {
      }
    }
    this.props.props.navigation.navigate('NewestScreen', {
      id: parent,
      name,
      sortOrder: 'newest'
    })
  }

  renderSeparator = () => (
    <View style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
  )

  render () {
    return this.props.sectionlist.length === 0 ? (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <UIActivityIndicator size={27} color={theme.loadingIndicatorColor} />
      </View>
    ) : (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={this.props.sectionlist}
        horizontal={this.props.vertical}
        numColumns={this.props.noOfCol}
        style={{ paddingBottom: this.props.viewButton ? 0 : 10 }}
        ItemSeparatorComponent={this.renderSeparator}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => (
          <View>
            <View>
              <Category5Style
                item={item.item.parent}
                id={item.inde + 1}
                products={this.props.products}
                image={
                  item.item.parent.image === null
                    ? ''
                    : item.item.parent.image.src
                }
                openSubCategories={(t, n) => this.openSubCategories(t, n)}
                header
              />
              {item.item.data.map(key => (
                <View>
                  <Category5Style
                    item={key}
                    id={item.index}
                    products={this.props.products}
                    image={key.image === null ? '' : key.image.src}
                    openSubCategories={(t, n) => this.openSubCategories(t, n)}
                  />
                  <View
                    style={{
                      height: 1,
                      width: '100%',
                      backgroundColor: '#ddd'
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      />
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
export default connect(mapStateToProps, null)(FlatListView)
