import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './QuestionAI.styles';

export default function QuestionAI() {
  return (
    <View style={styles.container}>
      <View>
        <Text>
          AI에게 물어보세용~
        </Text>
      </View>
    </View>
  );
}