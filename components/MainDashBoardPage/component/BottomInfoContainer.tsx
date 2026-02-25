import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import ExchangeGraph from '../../ExchangeDetailPage/component/ExchangeGraph';
import { styles } from './BottomInfoContainer.styles';
import { Typography } from '@/constants/Typography';

const screenWidth = Dimensions.get('window').width;

// 1. 내 저장 국가 데이터
const SAVED_COUNTRIES = [
  { name: '베트남', code: 'VND', flag: 'star' },
  { name: '일본', code: 'JPY', flag: 'disc' },
  { name: '캐나다', code: 'CAD', flag: 'leaf' },
];

// 2. 국가별 아이콘/이미지 매핑
const FLAG_MAP: Record<string, { icon: any; color: string; name: string }> = {
  'JPY': { icon: 'disc', color: '#BC002D', name: '일본 엔' },
  'USD': { icon: 'logo-usd', color: '#85bb65', name: '미국 달러' },
  'CNY': { icon: 'flag', color: '#EE1C25', name: '중국 위안' },
  'VND': { icon: 'star', color: '#FFFF00', name: '베트남 동' },
  'THB': { icon: 'flag', color: '#ED1C24', name: '태국 바트' },
  'PHP': { icon: 'flag', color: '#0038A8', name: '필리핀 페소' },
  'HKD': { icon: 'flower', color: '#7B001C', name: '홍콩 달러' },
  'TWD': { icon: 'flag', color: '#FE0000', name: '대만 달러' },
  'GBP': { icon: 'flag', color: '#00247D', name: '영국 파운드' },
};

interface BottomInfoContainerProps {
  data: any;
  isLoading?: boolean;
}

export default function BottomInfoContainer({ data, isLoading }: BottomInfoContainerProps) {
  
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!data) return null;

  const currentFlag = FLAG_MAP[data.code] || { icon: 'help-circle', color: '#ccc', name: '알 수 없음' };

  const handleGoToDetail = (countryParam?: { name: string; code: string; flag?: string }) => {
    // 인자가 없으면(상세보기 버튼 클릭 시) 현재 선택된 'data'를 사용
    const target = countryParam || {
      name: currentFlag.name,
      code: data.code,
      flag: currentFlag.icon,
    };

    router.push({
      pathname: '/exchange_detail',
      params: { ...target }
    });
  };

  return (
    <View style={styles.container}>
      
      {/* 1. 실시간 환율 정보 바 */}
      <View style={styles.rateInfoBar}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={[styles.rateText, Typography.Pretendard_B_24]}>{data.currentRate}</Text>
          <Text style={[Typography.Pretendard_M_16, { marginLeft: 4, color: '#333' }]}>₩</Text>
        </View>
        
        <View style={styles.countryInfo}>
          <Text style={[styles.countryName, Typography.Pretendard_M_14]}>{currentFlag.name}</Text>
          <View style={[styles.flagIcon, { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 2 }]}>
            <Ionicons name={currentFlag.icon} size={14} color={currentFlag.color} />
          </View>
        </View>
      </View>

      {/* 변동률 표시 */}
      <View style={{ paddingHorizontal: 10, marginTop: -10, marginBottom: 10 }}>
        <Text style={[Typography.Pretendard_M_12, { color: (data.change || 0) >= 0 ? '#E53935' : '#1E88E5' }]}>
          어제보다 {Math.abs(data.change || 0)}원 ({data.percentChange || 0}%) {(data.change || 0) >= 0 ? '▲' : '▼'}
        </Text>
      </View>

      {/* 2. 환율 그래프 영역 */}
      <View style={styles.graphArea}>
        <ExchangeGraph 
            code={data.code} 
            hideTitle={true} 
            height={160} 
            width={screenWidth - 80} 
        />
      </View>

      {/* 3. 하단 상세 보기 버튼 */}
      <TouchableOpacity 
        style={{ alignSelf: 'center', marginVertical: 10 }}
        onPress={() => handleGoToDetail()}
      >
        <Text style={[Typography.Pretendard_M_14, { color: '#888', textDecorationLine: 'underline' }]}>
          상세 정보 보러가기
        </Text>
      </TouchableOpacity>

      {/* 4. 내 저장 국가 리스트 */}
      <View style={styles.savedListContainer}>
        <Text style={[styles.savedListTitle, Typography.Pretendard_M_14]}>내 저장 국가 리스트</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollArea}>
          {SAVED_COUNTRIES.map((country, index) => (
            <View key={index} style={styles.countryItem}>
              <TouchableOpacity 
                style={styles.circleIcon}
                onPress={() => handleGoToDetail(country)}
                activeOpacity={0.7}
              >
                 <Text style={{fontSize: 10, color: '#888'}}>{country.code.substring(0,2)}</Text>
              </TouchableOpacity>
              <Text style={[styles.countryLabel, Typography.Pretendard_M_12]}>{country.name}</Text>
            </View>
          ))}
          
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