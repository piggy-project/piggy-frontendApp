import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { styles } from './Exchange.styles';

import ExchangeHeader from '../Header/ExchangeHeader';
import SearchCountry from './component/SearchCountry';
import ShowCountry from './component/ShowCountry';

// 1. 데이터 타입 정의
export interface CountryData {
  id: string;
  name: string;
  code: string;
  rate: string;
  flag: string;
}

// 2. 더미 데이터 (스크린샷 내용 반영)
const DUMMY_DATA: CountryData[] = [
  { id: '1', name: '미국', code: 'USD', rate: '1,460.10 KRW', flag: '🇺🇸' },
  { id: '2', name: '캐나다', code: 'CAD', rate: '1,200.50 KRW', flag: '🇨🇦' },
  { id: '3', name: '영국', code: 'GBP', rate: '1,950.30 KRW', flag: '🇬🇧' },
  { id: '4', name: '유럽연합', code: 'EUR', rate: '1,550.20 KRW', flag: '🇪🇺' },
  { id: '5', name: '일본', code: 'JPY', rate: '13.00 KRW', flag: '🇯🇵' },
  { id: '6', name: '호주', code: 'AUD', rate: '1,050.40 KRW', flag: '🇦🇺' },
  { id: '7', name: '스위스', code: 'CHF', rate: '1,700.80 KRW', flag: '🇨🇭' },
];

export default function ExchangePage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const filteredData = DUMMY_DATA.filter((item) => 
    item.name.includes(searchText) ||
    item.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const handlePressItem = (item: CountryData) => {
    router.push({
      pathname: '/exchange_detail',
      params: { 
        name: item.name, 
        code: item.code,
        rate: item.rate,
        flag: item.flag
      }
    });
  };

  return (
    <View style={styles.container}>
      <ExchangeHeader title="환율 목록" />
      
      <View style={[styles.sectionGap, { flex: 1 }]}>
        {/*<기능 컴포넌트 넣기/>*/}
        <SearchCountry 
          value={searchText} 
          onChangeText={setSearchText} 
        />
        <ShowCountry 
          data={filteredData} 
          onPressItem={handlePressItem} 
        />
      </View>
    </View>
  );
}