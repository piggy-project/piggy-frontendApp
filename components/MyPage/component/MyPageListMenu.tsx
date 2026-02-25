import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './MyPageListMenu.styles';

export default function MyPageListMenu() {
  const menus = ['최근 본 게시물', '고객센터', '설정'];

  return (
    <View style={styles.container}>
      {menus.map((menu) => (
        <TouchableOpacity key={menu} style={styles.menuItem}>
          <Text style={styles.menuText}>{menu}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}