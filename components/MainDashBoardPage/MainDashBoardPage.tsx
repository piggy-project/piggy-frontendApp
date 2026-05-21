import { exchangeApi } from '@/components/utils/api'; // API 함수 임포트
import { getCurrencyApiCode } from '@/constants/Currency';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import MainHeader from '../Header/MainHeader';
import { styles } from './MainDashBoard.styles';
import BottomInfoContainer from './component/BottomInfoContainer';
import ChoiceCountry from './component/ChoiceCountry';
import MainImageContainer from './component/MainImageContainer';

export default function MainDashBoardPage() {
  const [exchangeData, setExchangeData] = useState<any>(null); // 선택된 환율 정보를 담을 상태
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('JPY');

  const getCacheKey = (code: string) => `DASHBOARD_CACHE_${code}`;

  // 국가 선택 시 데이터를 가져오는 함수
  const handleCountrySelect = async (code: string) => {
    if (!code) return;
    const apiCode = getCurrencyApiCode(code);
    const cacheKey = getCacheKey(code);
    setSelectedCurrencyCode(code);

    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        setExchangeData(JSON.parse(cached));
      }

      const response = await exchangeApi.getExchangeDetail(apiCode);
      const freshData = {
        ...(response.data || response),
        code: apiCode,
        displayCode: code,
      };
      
      setExchangeData(freshData);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(freshData));
      
    } catch (error) {
      console.error('환율 상세 정보 로딩 에러:', error);
    }
  };

  // 앱 처음 진입 시 기본값(일본) 데이터 로드
  useEffect(() => {
    handleCountrySelect('JPY'); 
  }, []);

  return (
    <View style={styles.container}>
      <MainHeader />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionGap}>
          <ChoiceCountry onSelect={handleCountrySelect} />
          <MainImageContainer timing={exchangeData?.timing} />
          <BottomInfoContainer data={exchangeData} displayCode={selectedCurrencyCode} />
        </View>
      </ScrollView>
    </View>
  );
}
