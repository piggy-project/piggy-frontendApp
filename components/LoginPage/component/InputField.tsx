import { Typography } from '@/constants/Typography';
import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};

export default function InputField({ placeholder, value, onChangeText, secureTextEntry }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, Typography.Pretendard_M_16]}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
    color: '#000',
  },
});