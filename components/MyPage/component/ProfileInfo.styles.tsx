import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
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