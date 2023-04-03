import React, { PureComponent } from 'react'
import {
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Text,
  I18nManager,
  Platform
} from 'react-native'
import { createSelector } from 'reselect'
import { UIActivityIndicator } from 'react-native-indicators'
import CardTem from './CardTemplate'
import { Icon } from 'native-base'
import { appTextStyle } from './Theme.style'
import { connect } from 'react-redux'
import { colorFun } from '../redux/actions/actions'
const Width = Dimensions.get('window').width

class Fetch extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
      isLoading: true,
      page: 1,
      refreshing: false,
      finalCon: false,
      fabB: false,
      productView: this.props.productView,
      applyFilter: false,
      tempBox: [],
      productColorCounter: 0
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (props.dataSource.length === 0 && props.productView === 'list') {
      return {
        dataSource: props.dataSource,
        isLoading: true,
        finalCon: false,
        productView: 'list',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    }
    if (props.dataSource.length === 0 && props.productView === 'grid') {
      return {
        dataSource: props.dataSource,
        isLoading: true,
        finalCon: false,
        productView: 'grid',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    }
    if (
      props.dataSource.length !== 0 &&
      state.dataSource !== props.dataSource &&
      props.productView === 'grid'
    ) {
      return {
        dataSource: props.dataSource,
        isLoading: true,
        finalCon: false,
        productView: 'grid',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    } else if (
      props.dataSource.length === 0 &&
      props.page === 1 &&
      props.productView === 'grid'
    ) {
      return {
        dataSource: props.dataSource,
        isLoading: true,
        finalCon: false,
        productView: 'grid',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    } else if (
      props.dataSource.length === 0 &&
      props.page > 1 &&
      props.productView === 'grid'
    ) {
      return {
        refreshing: false,
        finalCon: true,
        productView: 'grid',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    }
    if (
      props.dataSource.length !== 0 &&
      state.dataSource !== props.dataSource &&
      props.productView === 'list'
    ) {
      return {
        dataSource: props.dataSource,
        isLoading: true,
        finalCon: false,
        productView: 'list',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    } else if (
      props.dataSource.length === 0 &&
      props.page === 1 &&
      props.productView === 'list'
    ) {
      return {
        dataSource: props.dataSource,
        isLoading: true,
        finalCon: false,
        productView: 'list',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    } else if (
      props.dataSource.length === 0 &&
      props.page > 1 &&
      props.productView === 'list'
    ) {
      return {
        refreshing: false,
        finalCon: true,
        productView: 'list',
        applyFilter: props.applyFilter,
        tempBox: []
      }
    }
    return null
  }

  static get options () {
    return {
      topBar: {
        title: {
          text: 'Fetch'
        }
      }
    }
  }

  componentDidMount () {
    this.props.onRef(this)
  }

  componentWillUnmount () {
    this.props.onRef(null)
    clearInterval(this.state.gridCheck)
  }

  showAlert = () => {
    if (this.state.productView === 'list') {
      this.setState({ productView: 'grid', gridCheck: true }, () => {
        setTimeout(() => {
          this.setState({ gridCheck: false })
        }, Math.floor(100 / 360000))
      })
    } else {
      this.setState({ productView: 'list', gridCheck: true }, () => {
        setTimeout(() => {
          this.setState({ gridCheck: false })
        }, Math.floor(100 / 360000))
      })
    }
  }

  renderItem = item =>
    this.state.productView === 'grid' ? (
      <View
        style={{
          marginBottom: 0,
          marginTop: 0
        }}>
        <CardTem
          objectArray={item.item}
          backgroundColor={colorFun(this, item.index)}
          rows={this.props.vertical}
          recent={this.state.recent}
          width={Width * 0.468}
        />
      </View>
    ) : (
      <CardTem
        objectArray={item.item}
        backgroundColor={colorFun(this, item.index)}
        rows={this.props.vertical}
        recent={this.state.recent}
        cardStyle={1}
        addToCart={true}
        width={Width * 0.96}
      />
    )

  renderSeparator = () => (
    <View style={{ height: 1, width: '100%', backgroundColor: '#ddd' }} />
  )

  handleLoadMore = () => {
    if (!this.state.finalCon && this.state.dataSource.length % 10 === 0) {
      this.setState(
        {
          refreshing: true,
          fabB: this.props.dataSource.length > 10
        },
        () => {
          if (this.state.tempBox.includes(this.props.page)) {
          } else {
            this.state.tempBox.push(this.props.page)
            this.props.functionPropNameHere()
          }
        }
      )
    } else if (
      !this.state.finalCon &&
      this.state.dataSource.length % 10 !== 0
    ) {
      this.setState({
        refreshing: false
      })
    }
  }

  renderFooter = () => {
    return (
      <View
        style={{
          marginBottom: 50,
          marginTop: 2,
          alignItems: 'center',
          alignSelf: 'center',
          alignContent: 'center'
        }}>
        {this.state.refreshing
          ? (
            <View style={{ height: 20, marginTop: 30, marginBottom: 20 }}>
              <UIActivityIndicator
                size={27}
                count={12}
                color={this.props.themeStyle.primary}
              />
            </View>
          ) : null}
      </View>
    )
  }

  handleScroll (event) {
    if (
      this.state.fabB &&
      event.nativeEvent.contentOffset.y >= 0 &&
      event.nativeEvent.contentOffset.y < 300
    ) {
      this.setState({ fabB: false })
    }
  }

  render () {
    return this.state.applyFilter && this.state.dataSource.length === 0 ? (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          alignContent: 'center',
          marginLeft: !I18nManager.isRTL ? Width * 0.28 : Width * 0.25
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            alignSelf: 'center'
          }}>
          <Icon name={'logo-dropbox'} style={{ color: 'gray', fontSize: 80 }} />

          <Text style={{
            fontSize: appTextStyle.largeSize + 2,
            color: this.props.themeStyle.textColor,
            fontFamily: appTextStyle.fontFamily
          }}>
            {this.props.isLoading.appConfig.languageJson['No Products Found']}
          </Text>
        </View>
      </View>
    ) : this.state.dataSource.length === 0 || this.state.gridCheck ? (
      !this.props.isEmpty
        ? <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center'
          }}>
          <UIActivityIndicator
            style={{ paddingLeft: Dimensions.get('window').width * 0.46 }}
            size={27}
            color={this.props.themeStyle.primary}
          />
        </View>
        : <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            width: Width
          }}>
          <Text style={{
            textAlign: 'center',
            alignSelf: 'center',
            fontSize: appTextStyle.largeSize + 2,
            color: this.props.themeStyle.textColor,
            fontFamily: appTextStyle.fontFamily
          }}>
            {this.props.language['No Products Found'] + ''}
          </Text>
        </View>
    ) : (
      <View style={{ flex: 1, width: Width }}>
        {this.state.fabB && this.state.dataSource.length > 9 ? (
          <TouchableOpacity
            style={{
              zIndex: 5,
              position: 'absolute',
              right: 22,
              bottom: 60
            }}
            onPress={() => {
              this.flatListRef.scrollToOffset({
                animated: true,
                offset: 0,
                useNativeDriver: true
              }, {
                useNativeDriver: true
              })
              this.setState({ fabB: false })
            }}>
            <View
              style={{
                alignItems: 'center',
                height: 48,
                width: 48,
                borderRadius: 400,
                alignSelf: 'center',
                justifyContent: 'center',
                backgroundColor: this.props.themeStyle.primary
              }}>
              <Icon
                name={'md-arrow-up'}
                style={{
                  color: this.props.themeStyle.textTintColor,
                  paddingTop: Platform.OS === 'ios' ? 2 : 0,
                  fontSize: 22
                }}
              />
            </View>
          </TouchableOpacity>
        ) : null}

        <FlatList
          onScroll={this.handleScroll.bind(this)}
          data={this.state.dataSource}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderItem}
          extraData={this.state}
          key={this.state.productView}
          ref={ref => {
            this.flatListRef = ref
          }}
          style={{
            backgroundColor: this.props.themeStyle.secondryBackgroundColor
          }}
          contentContainerStyle={{
            marginLeft: 0,
            marginRight: 0,
            paddingBottom: 0,
            marginBottom: 0,
            paddingTop: 0,
            marginTop: 0,
            alignSelf: this.state.dataSource.length === 1 ? 'flex-start' : 'center',
            backgroundColor: this.props.themeStyle.secondryBackgroundColor
          }}
          keyExtractor={(item, index) => index.toString()}
          numColumns={this.state.productView === 'grid' ? 2 : 1}
          ListFooterComponent={() => this.renderFooter()}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false
          }}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              this.handleLoadMore()
              this.onEndReachedCalledDuringMomentum = true
            }
          }}
          onEndReachedThreshold={0.5}
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
const mapStateToProps = state => ({
  themeStyle: getThemeFun(state),
  isLoading: state
})

export default connect(mapStateToProps, null)(Fetch)
