import { Typography } from '@/constants/Typography';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

// 통화 목록 데이터 (사진 참고)
const CURRENCIES = [
  { label: '대한민국', code: 'KRW' },
  { label: '미국', code: 'USD' },
  { label: '일본', code: 'JPY' },
  { label: '중국', code: 'CNY' },
  { label: '뉴질랜드', code: 'NZD' },
  { label: '대만', code: 'TWD' },
  { label: '베트남 ', code: 'VND' },
  { label: '싱가포르', code: 'SGD' },
  { label: '필리핀', code: 'PHP' },
  { label: '태국', code: 'THB' },
  { label: '호주', code: 'AUD' },
  { label: '홍콩', code: 'HKD' },
];

interface Props {
  onSelect?: (currency: string) => void; // 선택 시 실행될 함수 (선택사항)
}

export default function WonSign({ onSelect }: Props) {
  const [visible, setVisible] = useState(false);

  // 통화 선택 시 처리
  const handleSelect = (currency: any) => {
    setVisible(false);
    if (onSelect) {
      onSelect(currency);
    }
    console.log('선택된 통화:', currency.label);
  };

  return (
    <View>
      {/* 1. 헤더에 보일 원화 아이콘 버튼 */}
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image
          source={require('@/assets/images/WonSign.png')} // 경로 확인해주세요
          style={styles.wonsign}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* 2. 클릭 시 뜨는 통화 선택 모달 */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        {/* 배경을 누르면 닫히도록 설정 */}
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setVisible(false)}
        >
          {/* 실제 드롭다운 리스트 박스 */}
          <TouchableWithoutFeedback>
            <View style={styles.dropdownContainer}>
              <FlatList
                data={CURRENCIES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.item} 
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={[styles.itemText, Typography.Pretendard_M_14]}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                // 아이템 사이 구분선
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wonsign: {
    width: 24,  // 아이콘 크기 조절
    height: 24,
  },
  // 모달 뒷배경 (투명하지만 터치 감지용)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)', // 살짝 어둡게 (완전 투명을 원하면 'transparent')
    justifyContent: 'flex-start', // 위쪽 정렬
  },
  // 드롭다운 박스 스타일
  dropdownContainer: {
    marginTop: 100, // 헤더 높이만큼 아래로 띄우기 (조절 필요)
    marginLeft: 20, // 왼쪽 여백
    width: 160,     // 드롭다운 너비
    maxHeight: 400, // 너무 길어지면 스크롤 되게
    backgroundColor: 'white',
    borderRadius: 12,
    
    // 그림자 설정
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    paddingVertical: 5,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center', // 텍스트 가운데 정렬
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
});