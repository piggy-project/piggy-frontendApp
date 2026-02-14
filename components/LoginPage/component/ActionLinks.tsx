import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  onFindId: () => void;
  onFindPw: () => void;
};

export default function ActionLinks({ onFindId, onFindPw }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onFindId}>
        <Text style={styles.text}>아이디 찾기</Text>
      </TouchableOpacity>
      
      <Text style={styles.divider}>|</Text>
      
      <TouchableOpacity onPress={onFindPw}>
        <Text style={styles.text}>비밀번호 찾기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    marginHorizontal: 15,
    color: '#ccc',
  },
});