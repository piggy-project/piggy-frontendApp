import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './MainHeader.styles';

export default function MainHeader() {

  return (
    <View style={[
      styles.container
    ]}>
      <View style={styles.leftArea}>
        <Text style={styles.logoText}>우리 로고</Text>
      </View>

      <Text style={styles.title}>SOM</Text>

      <TouchableOpacity style={styles.rightArea}>
        <Ionicons name="person-circle-outline" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}