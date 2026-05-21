import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './MainImageContainer.styles';

interface MainImageContainerProps {
  timing?: number;
}

const piggyImages = {
  level1: require('@/assets/images/piggy0-20.png'),
  level2: require('@/assets/images/piggy20-40.png'),
  level3: require('@/assets/images/piggy40-60.png'),
  level4: require('@/assets/images/piggy60-80.png'),
  level5: require('@/assets/images/piggy80-100.png'),
};

const getPiggyStatus = (timing: number) => {
  if (timing > 80) return { img: piggyImages.level5, text: ["지금이 당장 환전할", "최고의 타이밍이에요!"] };
  if (timing > 60) return { img: piggyImages.level4, text: ["환율이 꽤 저렴해요!", "환전하기 좋은 날이에요."] };
  if (timing > 40) return { img: piggyImages.level3, text: ["무난한 환율이에요.", "조금 더 기다려볼까요?"] };
  if (timing > 20) return { img: piggyImages.level2, text: ["지금은 조금 비싸네요.", "급하지 않다면 참아봐요."] };
  return { img: piggyImages.level1, text: ["환율이 너무 올랐어요!", "나중에 다시 확인해요."] };
};

export default function MainImageContainer({ timing }: MainImageContainerProps) {
  const { img, text } = getPiggyStatus(timing ?? 50);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={img}
        style={styles.background}
        resizeMode="cover"
        imageStyle={{}}
      >
        
        {/* 1. 상단 타이틀 */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, Typography.Pretendard_B_24]}>{text[0]}</Text>
          <Text style={[styles.title, Typography.Pretendard_B_24]}>{text[1]}</Text>
          <Text style={[styles.titletext, Typography.Pretendard_M_11]}>최근 3개월 기준으로 계산된 값이에요.</Text>
        </View>

        {/* 2. 하단 목표 환율 버튼 */}
        <TouchableOpacity style={styles.targetRateButton} activeOpacity={0.8}>
          <Text style={[styles.targetRateText, Typography.Pretendard_M_14]}>목표 환율 | 5,000￦</Text>
          <Ionicons name="pencil" size={14} color="#555" style={{ marginLeft: 5 }} />
        </TouchableOpacity>

      </ImageBackground>
    </View>
  );
}