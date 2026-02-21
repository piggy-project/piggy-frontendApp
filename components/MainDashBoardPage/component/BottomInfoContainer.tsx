import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ExchangeGraph from '../../ExchangeDetailPage/component/ExchangeGraph';
import { styles } from './BottomInfoContainer.styles';
import { Typography } from '@/constants/Typography';
const screenWidth = Dimensions.get('window').width;

// 저장된 국가 리스트 (가짜 데이터)
const SAVED_COUNTRIES = [
  { name: '베트남', code: 'VND', flag: 'star' }, // 예시로 아이콘 이름이나 이미지 경로를 넣음
  { name: '일본', code: 'JPY', flag: 'disc' },
  { name: '캐나다', code: 'CAD', flag: 'leaf' },
  { name: '한국', code: 'KRW', flag: 'flag' }, // 한국 코드 추가
  { name: '브라질', code: 'BRL', flag: 'football' }, // 브라질 코드 추가
];

export default function BottomInfoContainer() {
  const handleGoToDetail = (country: { name: string; code: string; flag?: string }) => {
    // router.push를 통해 경로와 파라미터를 전달합니다.
    router.push({
      pathname: '/exchange_detail',
      params: {
        name: country.name,
        code: country.code,
        flag: country.flag || 'default', // flag가 없으면 기본값 전달
      }
    });
  };

  return (
    <View style={styles.container}>
      
      {/* 1. 현재 환율 정보 바 */}
      <View style={styles.rateInfoBar}>
        <Text style={[styles.rateText, Typography.Pretendard_M_16]}>5.5243₩</Text>
        <View style={styles.countryInfo}>
          <Text style={[styles.countryName, Typography.Pretendard_M_14]}>베트남 동</Text>
          {/* 베트남 국기 (임시로 빨간 원 아이콘 사용, 실제 이미지로 교체 가능) */}
          <View style={styles.flagIcon}>
            <Ionicons name="star" size={12} color="#FFFF00" />
          </View>
        </View>
      </View>

      {/* 2. 환율 그래프 영역 */}
      <View style={styles.graphArea}>
        {/* 그래프 컴포넌트 삽입 (국가 코드는 예시로 'VND') */}
        <ExchangeGraph 
            code="VND" 
            hideTitle={true} 
            height={170} 
            width={screenWidth - 80} 
        />
      </View>

      {/* 3. 내 저장 국가 리스트 */}
      <View style={styles.savedListContainer}>
        <Text style={[styles.savedListTitle, Typography.Pretendard_M_14]}>내 저장 국가 리스트</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollArea}>
          {SAVED_COUNTRIES.map((country, index) => (
            <View key={index} style={styles.countryItem}>
              {/* 회색 원 (국기 들어갈 자리) */}
              <TouchableOpacity 
                style={styles.circleIcon}
                onPress={() => handleGoToDetail(country)}
                activeOpacity={0.7}
              >
                 {/* 예시: 그냥 텍스트로 국가 코드 앞글자 표시 */}
                 <Text style={{fontSize: 10, color: '#888'}}>{country.code.substring(0,2)}</Text>
              </TouchableOpacity>
              <Text style={[styles.countryLabel, Typography.Pretendard_M_12]}>{country.name}</Text>
            </View>
          ))}
          
          {/* 추가 버튼 예시 */}
           <View style={styles.countryItem}>
              <TouchableOpacity style={[styles.circleIcon, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc' }]}>
                 <Ionicons name="add" size={24} color="#ccc" />
              </TouchableOpacity>
              <Text style={styles.countryLabel}></Text>
            </View>
        </ScrollView>
      </View>

    </View>
  );
}