import { exchangeApi } from '@/components/utils/api'; // API 함수 임포트
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, View } from 'react-native';
import MainHeader from '../Header/MainHeader';
import { styles } from './MainDashBoard.styles';
import BottomInfoContainer from './component/BottomInfoContainer';
import ChoiceCountry from './component/ChoiceCountry';
import MainImageContainer from './component/MainImageContainer';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MainDashBoardPage() {
  const INITIAL_TOP = SCREEN_HEIGHT * 0.5;
  const [exchangeData, setExchangeData] = useState<any>(null); // 선택된 환율 정보를 담을 상태
  
  const panY = useRef(new Animated.Value(INITIAL_TOP)).current;
  const lastOffset = useRef(INITIAL_TOP);

  const getCacheKey = (code: string) => `DASHBOARD_CACHE_${code}`;

  // 국가 선택 시 데이터를 가져오는 함수
  const handleCountrySelect = async (code: string) => {
    if (!code) return;
    const cacheKey = getCacheKey(code);

    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        setExchangeData(JSON.parse(cached));
      }

      const response = await exchangeApi.getExchangeDetail(code);
      const freshData = response.data || response;
      
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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        panY.setOffset(lastOffset.current);
        panY.setValue(0);
      },
      onPanResponderMove: (event, gestureState) => {
        const nextPosition = lastOffset.current + gestureState.dy;
        if (nextPosition > INITIAL_TOP) {
          panY.setValue(INITIAL_TOP - lastOffset.current); 
        } else {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        panY.flattenOffset(); 
        if (gestureState.dy < -100 || (lastOffset.current < INITIAL_TOP && gestureState.dy < 50)) {
          lastOffset.current = 150;
          Animated.spring(panY, { toValue: 150, useNativeDriver: false, bounciness: 8 }).start();
        } else {
          lastOffset.current = INITIAL_TOP;
          Animated.spring(panY, { toValue: INITIAL_TOP, useNativeDriver: false, bounciness: 8 }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        <View>
          <ChoiceCountry onSelect={handleCountrySelect} />
        </View>
        
        {/* 선택된 국가의 타이밍 정보를 이미지 컨테이너로 전달 */}
        <MainImageContainer timing={exchangeData?.timing} />

        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: [{ translateY: panY }],
            }
          ]}
          {...panResponder.panHandlers}
        >
          {/* 4. 가져온 데이터를 하단 시트로 전달 */}
          <BottomInfoContainer data={exchangeData} />
        </Animated.View>
      </View>
    </View>
  );
}