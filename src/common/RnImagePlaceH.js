import React from 'react'
import FastImage from 'react-native-fast-image'
const ImageLoad = ({
  style,
  source
}) => (
  source.uri === undefined || source.uri === null || source.uri === ''
    ? <FastImage
      style={[{ position: 'relative' }, style]}
      source={source}
    />
    : <FastImage
      style={[{ position: 'relative' }, style]}
      source={{
        uri: getUriImage2(source),
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable
      }}
    />
)
function getUriImage2 (source) {
  const normalisedSource = source && typeof source.uri === 'string' && (source.uri.split('https://')[1] || source.uri.split('http://')[1]) ? source : null
  if (normalisedSource === null) { return normalisedSource } else { return normalisedSource.uri }
}
export default ImageLoad
