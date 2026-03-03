import { Typography } from '@/constants/Typography';
import React from 'react';
import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ComparisonResultList({ data }: { data: any }) {
  const hasRakutenData = data?.rakutenResults?.Items?.length > 0;
  const hasSerpData = data?.serpResults?.length > 0;

  if (!data || (!hasRakutenData && !hasSerpData)) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, Typography.Pretendard_B_16]}>검색 결과 비교</Text>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>검색 결과가 없습니다.</Text>
      </View>
    );
  }

  const { naverResults, rakutenResults, serpResults, exchangeRate, currencyCode } = data;
  const naverBestPrice = naverResults?.items?.[0]?.lprice || 0;

  const calculateKrw = (localPrice: number) => {
    const isHundredUnit = ['JPY', 'VND'].includes(currencyCode);
    return isHundredUnit 
      ? Math.floor((localPrice * exchangeRate) / 100) 
      : Math.floor(localPrice * exchangeRate);
  };

  // 클릭 시 브라우저를 여는 핸들러
  const openProductLink = async (url: string) => {
    if (!url || !url.startsWith('http')) {
      Alert.alert("알림", "연결 가능한 상품 페이지가 없습니다.");
      return;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  // 공통 카드 렌더링 함수 (link 인자 추가)
  const renderItemCard = (item: any, key: string, link: string) => {
    const priceInKrw = calculateKrw(item.price);
    const diff = naverBestPrice - priceInKrw;

    return (
      <TouchableOpacity 
        key={key} 
        style={styles.card} 
        onPress={() => openProductLink(link)}
        activeOpacity={0.8}
      >
        <View style={styles.row}>
          <Image 
            source={{ uri: item.image || 'https://via.placeholder.com/80' }} 
            style={styles.image} 
          />
          <View style={styles.info}>
            <Text numberOfLines={2} style={[styles.itemName, Typography.Pretendard_M_14]}>
              {item.name}
            </Text>
            
            <View style={styles.priceRow}>
              <Text style={[styles.localPrice, Typography.Pretendard_B_16]}>
                {item.price.toLocaleString()} {currencyCode}
              </Text>
              <Text style={[styles.krwPrice, Typography.Pretendard_M_12]}>
                (약 {priceInKrw.toLocaleString()}원)
              </Text>
            </View>

            <View style={styles.compareBox}>
              <Text style={Typography.Pretendard_M_12}>국내 최저가 대비 </Text>
              <Text style={[
                Typography.Pretendard_B_16, 
                { color: diff > 0 ? '#E74C3C' : '#2ECC71' }
              ]}>
                {diff > 0 ? `${diff.toLocaleString()}원 저렴` : `${Math.abs(diff).toLocaleString()}원 비쌈`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, Typography.Pretendard_B_16]}>검색 결과 비교</Text>
      
      {/* 4. 일본(라쿠텐) 리스트: item.itemUrl 사용 */}
      {currencyCode === 'JPY' && rakutenResults?.Items?.map((itemObj: any, index: number) => {
        const item = itemObj.Item;
        return renderItemCard({
          name: item.itemName,
          price: item.itemPrice,
          image: item.mediumImageUrls?.[0]?.imageUrl,
        }, `rakuten-${index}`, item.itemUrl);
      })}

      {/* 5. 동남아/미국/유럽 (SERP/eBay 리스트): item.link 사용 */}
      {currencyCode !== 'JPY' && serpResults?.map((item: any, index: number) => {
        return renderItemCard({
          name: item.title,
          price: item.price,
          image: item.thumbnail,
        }, `serp-${index}`, item.link);
      })}
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