import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function Piggylogo() {
  return (
    <Image 
          source={require('@/assets/images/signupPiggy.png')} 
          style={styles.piggyImage} 
          resizeMode="contain"
        />
  );
}

const styles = StyleSheet.create({
  piggyImage: {
    width: 30,
    height: 30,
  },
});
