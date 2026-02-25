import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './MyPageActionButtons.styles';

export default function MyPageActionButtons() {
  const actions = ['게시물', '댓글', '좋아요'];

  return (
    <View style={styles.container}>
      {actions.map((item) => (
        <TouchableOpacity key={item} style={styles.button}>
          <Text style={styles.buttonText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}