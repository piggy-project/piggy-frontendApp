import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { styles } from './ChoiceCountry.style';
import { Typography } from '@/constants/Typography';

const COUNTRIES = ['베트남', '일본', '캐나다', '--', '미국', '중국', '태국'];

interface Props {
  onSelect?: (country: string) => void;
}

export default function ChoiceCountry({ onSelect }: Props) {
  const [selectedCountry, setSelectedCountry] = useState('베트남');

  const handlePress = (country: string) => {
    setSelectedCountry(country);
    if (onSelect) onSelect(country);
  };

  return (
    <ScrollView 
      horizontal={true}                // 가로 스크롤 허용
      showsHorizontalScrollIndicator={false} // 스크롤바 숨기기
      contentContainerStyle={styles.container} // 스타일 적용
      bounces={false}                  // iOS에서 튕기는 효과 제거
      style={{ flexGrow: 0 }}
    >
      {COUNTRIES.map((country) => {
        const isSelected = selectedCountry === country;
        return (
          <TouchableOpacity
            key={country}
            style={[
              styles.tabItem,
              isSelected && styles.selectedTabItem
            ]}
            onPress={() => handlePress(country)}
            activeOpacity={0.7}
          >
            <Text style={[styles.text, isSelected && styles.selectedText, Typography.Pretendard_M_14]}>
              {country}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}