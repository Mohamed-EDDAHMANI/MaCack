import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const LottieAnimation = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={{
          uri: "https://lottie.host/eddaa166-e48b-462a-820d-9042b443cbae/0z39Wotybu.lottie"
        }}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

export default LottieAnimation;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  animation: {
    width: 300,
    height: 300
  }
});