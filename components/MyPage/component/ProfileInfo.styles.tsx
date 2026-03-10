import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25, // 📍 완벽한 원형
    overflow: 'hidden', // 📍 영역 밖 이미지 잘라내기
    backgroundColor: '#F5F5F5',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // 비율 유지하며 꽉 채우기
  },
  imageText: { 
    color: '#666' 
  },
  infoContent: {
    flex: 1,           // 남은 공간을 다 차지함
    marginLeft: 16,    // 이미지와의 간격
    alignItems: 'flex-start', // 닉네임을 왼쪽으로 정렬
  },
  nickname: {
    color: '#000',
  },
});