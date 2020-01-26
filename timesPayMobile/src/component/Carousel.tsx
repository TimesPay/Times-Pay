import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native'
import React, { Component } from 'react'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import { TouchableHighlight } from 'react-native-gesture-handler';


const DEVICE_WIDTH = Dimensions.get("window").width
export default class Carousel extends Component
{
  scrollRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
    this.scrollRef = React.createRef();
  }

  setSelectedIndex = event => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    const newSelectedIndex = Math.floor(contentOffset.x / viewSize.width);
    this.setState({ selectedIndex: newSelectedIndex });
  };

  handleOnPress = (index) => {
    this.setState(
      prev => ({
        selectedIndex: index
      }),
      () => {
        this.scrollRef.current.scrollTo({
          animated: true,
          x: DEVICE_WIDTH * index,
          y: 0
        });
      }
    );
  }

  render() {
    const { images } = this.props;
    return (
      <>
      <View style={styles.container}>
        <ScrollView
          horizontal
          pagingEnabled
          onMomentumScrollEnd={this.setSelectedIndex}
          ref={this.scrollRef}>
          {
            images.map(image => (
              <Image
                style={styles.backgroundImage}
                source={{ uri: image }}
                key={image}/>
            ))
          }
        </ScrollView>
      </View>
      <View style={styles.circleDiv}>
          {images.map((image, i) => (
            <TouchableHighlight
              style={{
                ...styles.whiteCircle,
                opacity: this.state.selectedIndex === i ? 1 : 0.1
              }}
              key={image}
              onPress={() => this.handleOnPress(i)}
            />
          ))}
      </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: "5%",
    height: "55%",
    display: "flex",
    justifyContent: "center",
    alignContent: "center"
  },
  backgroundImage: {
    height: "100%",
    width: Dimensions.get("window").width
  },
  circleDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginBottom: wp('20%')
  },
  whiteCircle: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: 3,
    margin: wp('1%'),
    backgroundColor: "#694FAD"
  }
})