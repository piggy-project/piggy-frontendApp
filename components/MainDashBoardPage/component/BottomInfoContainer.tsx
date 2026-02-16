import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ExchangeGraph from '../../ExchangeDetailPage/component/ExchangeGraph';
import { styles } from './BottomInfoContainer.styles';
const screenWidth = Dimensions.get('window').width;

// 저장된 국가 리스트 (가짜 데이터)
const SAVED_COUNTRIES = [
  { name: '베트남', code: 'VND' },
  { name: '일본', code: 'JPY' },
  { name: '캐나다', code: 'CAD' },
  { name: '한국', code: '' },
  { name: '브라질', code: '' },
];

export default function BottomInfoContainer() {
  return (
    <View style={styles.container}>
      
      {/* 1. 현재 환율 정보 바 */}
      <View style={styles.rateInfoBar}>
        <Text style={styles.rateText}>5.5243₩</Text>
        <View style={styles.countryInfo}>
          <Text style={styles.countryName}>베트남 동</Text>
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
        <Text style={styles.savedListTitle}>내 저장 국가 리스트</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollArea}>
          {SAVED_COUNTRIES.map((country, index) => (
            <View key={index} style={styles.countryItem}>
              {/* 회색 원 (국기 들어갈 자리) */}
              <TouchableOpacity style={styles.circleIcon}>
                 {/* 이미지 넣을거면 여기에 Image 컴포넌트 추가 */}
              </TouchableOpacity>
              <Text style={styles.countryLabel}>{country.name}</Text>
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