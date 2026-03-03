import { exchangeApi } from '@/components/utils/api'; // API 함수 임포트
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

  // 국가 선택 시 데이터를 가져오는 함수
  const handleCountrySelect = async (code: string) => {
    if (!code) return;

    try {
      console.log("선택된 통화 코드:", code); // 디버깅용 로그
      const data = await exchangeApi.getExchangeDetail(code);
      setExchangeData(data);
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
        
        {/* 선택된 국가 코드를 이미지 컨테이너로 전달 (필요 시) */}
        <MainImageContainer />

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