import React from 'react';
import { TextInput, View } from 'react-native';
import { styles } from './SearchCountry.styles';

interface SearchCountryProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchCountry({ value, onChangeText }: SearchCountryProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="국가 검색"
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}