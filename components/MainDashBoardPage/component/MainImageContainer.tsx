import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './MainImageContainer.styles';

export default function MainImageContainer() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/piggyicon.png')}
        style={styles.background}
        resizeMode="cover"
        imageStyle={{}}
      >
        
        {/* 1. 상단 타이틀 */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>지금이 당장 환전할</Text>
          <Text style={styles.title}>타이밍이에요!</Text>
        </View>

        {/* 2. 하단 목표 환율 버튼 (캡슐 모양) */}
        <TouchableOpacity style={styles.targetRateButton} activeOpacity={0.8}>
          <Text style={styles.targetRateText}>목표 환율 | 5,000￦</Text>
          <Ionicons name="pencil" size={14} color="#555" style={{ marginLeft: 5 }} />
        </TouchableOpacity>

      </ImageBackground>
    </View>
  );
}