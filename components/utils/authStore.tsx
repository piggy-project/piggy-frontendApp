import AsyncStorage from '@react-native-async-storage/async-storage';

// 토큰 저장하기
export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (e) {
    console.error('토큰 저장 실패', e);
  }
};

// 토큰 가져오기 (자동 로그인용)
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (e) {
    console.error('토큰 불러오기 실패', e);
    return null;
  }
};

// 토큰 삭제하기 (로그아웃용)
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
  } catch (e) {
    console.error('토큰 삭제 실패', e);
  }
};