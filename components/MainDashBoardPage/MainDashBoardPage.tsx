import React, { useRef } from 'react';
import { Animated, Dimensions, PanResponder, View } from 'react-native';
import MainHeader from '../Header/MainHeader';
import { styles } from './MainDashBoard.styles';
import BottomInfoContainer from './component/BottomInfoContainer';
import ChoiceCountry from './component/ChoiceCountry';
import MainImageContainer from './component/MainImageContainer';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MainDashBoardPage() {
  const INITIAL_TOP = SCREEN_HEIGHT * 0.5;
  
  // 1. 실제 애니메이션되는 값
  const panY = useRef(new Animated.Value(INITIAL_TOP)).current;
  
  // 2. 마지막으로 멈췄던 위치를 기억할 변수
  const lastOffset = useRef(INITIAL_TOP);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: () => {
        panY.setOffset(lastOffset.current);
        panY.setValue(0);
      },

      onPanResponderMove: (event, gestureState) => {
        // 현재 위치가 초기 위치(INITIAL_TOP)보다 더 내려가려고 하면 무시
        // lastOffset.current + gestureState.dy는 "예상되는 다음 위치"입니다.
        const nextPosition = lastOffset.current + gestureState.dy;

        // INITIAL_TOP보다 커지면(더 아래로 내려가면) 움직이지 않게 막음
        if (nextPosition > INITIAL_TOP) {
          // 억지로 내리려고 할 때 약간의 저항감을 주고 싶다면 아래 줄 사용 (선택사항)
          //panY.setValue(gestureState.dy / 3); 
          
          // 아예 못 내리게 하려면 그냥 값을 업데이트 안 하거나, 한계값으로 고정
          panY.setValue(INITIAL_TOP - lastOffset.current); 
        } else {
          // 위로 올릴 때는 정상적으로 이동
          panY.setValue(gestureState.dy);
        }
      },

      onPanResponderRelease: (event, gestureState) => {
        panY.flattenOffset(); 

        // 현재 위치 확인
        // (flattenOffset 호출 후에는 panY._value를 직접 확인하기 어려우므로 lastOffset을 업데이트하며 판단)
        
        // 올리는 동작 감지 (위로 100 이상 밀었거나, 위쪽 영역에 있을 때)
        if (gestureState.dy < -100 || (lastOffset.current < INITIAL_TOP && gestureState.dy < 50)) {
          // 끝까지 올리기
          lastOffset.current = 150;
          Animated.spring(panY, {
            toValue: 150,
            useNativeDriver: false,
            bounciness: 8, // 약간의 탄성 추가
          }).start();
        } else {
          // 다시 초기 위치로 복귀 (내리는 동작)
          lastOffset.current = INITIAL_TOP;
          Animated.spring(panY, {
            toValue: INITIAL_TOP,
            useNativeDriver: false,
             bounciness: 8,
          }).start();
        }
      },
    })
  ).current;

  const handleCountrySelect = (country: string) => {
    console.log(`[메인페이지] ${country} 데이터 요청 중...`);
    
    // 나중에 여기에 API 코드를 넣으면 됩니다.
    // fetch(`http://.../api/rates?country=${country}`)
    //   .then(res => res.json())
    //   .then(data => { ... })
  };

  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={[styles.sectionGap, { flex: 1 }]}>
        {/*<기능 컴포넌트 넣기/>*/}
        <View>
          <ChoiceCountry onSelect={handleCountrySelect} />
        </View>
        
        <MainImageContainer/>
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: [{ translateY: panY }], // 애니메이션 값 연결
            }
          ]}
          {...panResponder.panHandlers} // 터치 이벤트 연결
        >
        <BottomInfoContainer />
      </Animated.View>
        {/*<QuestionAI/>*/}
      </View>
    </View>
  );
}