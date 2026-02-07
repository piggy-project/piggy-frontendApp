import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { styles } from './ExchangeDetail.styles';

import ExchangeHeader from '../Header/ExchangeHeader';
import ExchangeGraph from './component/ExchangeGraph';

export default function ExchangeDetailPage() {
    const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ExchangeHeader 
                country={String(params.name)} 
                code={String(params.code)}
                flag={String(params.flag)}
            />
      
      <View style={[styles.sectionGap, { flex: 1 }]}>
        {/*<기능 컴포넌트 넣기/>*/}
        <ExchangeGraph code={String(params.code)} />
        
      </View>
    </View>
  );
}