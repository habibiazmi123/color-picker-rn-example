/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const ColorPicker = ({colors, start, end, style, maxWidth, onColorChange}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const adjustTranslateX = useDerivedValue(() => {
    return Math.min(
      Math.max(translateX.value, 0),
      maxWidth - CIRCLE_PICKER_SIZE,
    );
  });

  const onEnd = useCallback(() => {
    'worklet';
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
  }, []);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.x = adjustTranslateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.x;
    },
    onEnd,
  });

  const tapGestureHandler = useAnimatedGestureHandler({
    onStart: event => {
      translateY.value = withSpring(-CIRCLE_PICKER_SIZE);
      scale.value = withSpring(1.2);
      translateX.value = withTiming(event.absoluteX - CIRCLE_PICKER_SIZE);
    },
    onEnd,
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: adjustTranslateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
      ],
    };
  });

  const rInternalPickerStyle = useAnimatedStyle(() => {
    const inputRange = colors.map(
      (_, index) => (index / colors.length) * maxWidth,
    );

    const backgroundColor = interpolateColor(
      translateX.value,
      inputRange,
      colors,
    );

    onColorChange?.(backgroundColor);

    return {
      backgroundColor: backgroundColor,
    };
  });

  return (
    <TapGestureHandler onGestureEvent={tapGestureHandler}>
      <Animated.View>
        <PanGestureHandler onGestureEvent={panGestureHandler}>
          <Animated.View style={styles.container}>
            <LinearGradient
              colors={colors}
              start={start}
              end={end}
              style={style}
            />
            <Animated.View style={[styles.picker, rStyle]}>
              <Animated.View
                style={[styles.internalPicker, rInternalPickerStyle]}
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};

const CIRCLE_PICKER_SIZE = 50;
const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE / 2;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  picker: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: '#FFF',
    width: CIRCLE_PICKER_SIZE,
    height: CIRCLE_PICKER_SIZE,
    borderRadius: CIRCLE_PICKER_SIZE / 2,
  },
  internalPicker: {
    width: INTERNAL_PICKER_SIZE,
    height: INTERNAL_PICKER_SIZE,
    borderRadius: CIRCLE_PICKER_SIZE / 2,
    borderWidth: 0.4,
    borderColor: 'rbga(0,0,0,0.2)',
  },
});

export default ColorPicker;
