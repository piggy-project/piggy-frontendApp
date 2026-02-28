import { Typography } from '@/constants/Typography';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function ComparisonResultList({ data }: { data: any }) {
  // 데이터가 없을 경우를 대비한 안전장치
  if (!data || !data.rakutenResults) return null;

  const { naverResults, rakutenResults, exchangeRate } = data;
  const rakutenItems = rakutenResults.Items || []; 
  
  // 네이버 최저가 (sony 검색 결과 첫 번째 상품 가격)
  const naverBestPrice = naverResults?.items?.[0]?.lprice || 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, Typography.Pretendard_B_16]}>검색 결과 비교</Text>
      
      {rakutenItems.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>검색 결과가 없습니다.</Text>
      ) : (
        rakutenItems.map((itemObj: any, index: number) => {
          const item = itemObj.Item;
          if (!item) return null;

          const imageUrl = item.mediumImageUrls?.[0]?.imageUrl;
          
          // JPY 100 기준 환율 계산 (현재 환율: 924.58)
          const priceInKrw = Math.floor((item.itemPrice * exchangeRate) / 100);
          const diff = naverBestPrice - priceInKrw;

          return (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <Image 
                  source={{ uri: imageUrl || 'https://via.placeholder.com/80' }} 
                  style={styles.image} 
                />
                <View style={styles.info}>
                  <Text numberOfLines={2} style={[styles.itemName, Typography.Pretendard_M_14]}>
                    {/* 네이버와 달리 라쿠텐은 HTML 태그가 없을 수 있지만 안전하게 처리 */}
                    {item.itemName}
                  </Text>
                  
                  <View style={styles.priceRow}>
                    <Text style={[styles.localPrice, Typography.Pretendard_B_16]}>
                      {item.itemPrice.toLocaleString()} JPY
                    </Text>
                    <Text style={[styles.krwPrice, Typography.Pretendard_M_12]}>
                      (약 {priceInKrw.toLocaleString()}원)
                    </Text>
                  </View>

                  <View style={styles.compareBox}>
                    <Text style={Typography.Pretendard_M_12}>국내 최저가({naverBestPrice.toLocaleString()}원) 대비 </Text>
                    <Text style={[
                      Typography.Pretendard_B_16, 
                      { color: diff > 0 ? '#E74C3C' : '#2ECC71' }
                    ]}>
                      {diff > 0 ? `${diff.toLocaleString()}원 저렴` : `${Math.abs(diff).toLocaleString()}원 비쌈`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { marginBottom: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  row: { flexDirection: 'row' },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 12, backgroundColor: '#f9f9f9' },
  info: { flex: 1, justifyContent: 'space-between' },
  itemName: { color: '#333', marginBottom: 5 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  localPrice: { color: '#000', marginRight: 5 },
  krwPrice: { color: '#888' },
  compareBox: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 5,
    borderRadius: 4,
    flexWrap: 'wrap'
  }
});