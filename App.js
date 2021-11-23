/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {PinchGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import ColorPicker from './src/components/ColorPicker';
import {width, BACKGROUND_COLOR, COLORS} from './src/contant';

const CIRCLE_SIZE = width * 0.8;
const PICKER_WIDTH = width * 0.9;

const App = () => {
  const pickedColor = useSharedValue(COLORS[0]);
  const scale = useSharedValue(1);

  const onColorChanged = useCallback(color => {
    'worklet';
    pickedColor.value = color;
  }, []);

  const circleStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pickedColor.value,
    };
  });

  const pinchHandler = useAnimatedGestureHandler({
    onActive: event => {
      scale.value = event.scale;
    },
    onEnd: event => {
      console.log(event);
    },
  });

  const circleScale = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}],
    };
  });

  return (
    <>
      <StatusBar barStyle="light-content" />

      <View style={styles.topContainer}>
        <PinchGestureHandler onGestureEvent={pinchHandler}>
          <Animated.View style={[styles.containerCircle, circleScale]}>
            <Animated.View style={[styles.circleColorView, circleStyle]} />
          </Animated.View>
        </PinchGestureHandler>
      </View>
      <View style={styles.bottomContainer}>
        <ColorPicker
          colors={COLORS}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradient}
          maxWidth={PICKER_WIDTH}
          onColorChange={onColorChanged}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 3,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCircle: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleColorView: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    shadowColor: '#ddd',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  gradient: {
    height: 50,
    width: PICKER_WIDTH,
    borderRadius: 25,
  },
});

export default App;
