import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'userToken';

// 토큰 저장 (암호화되어 저장됨)
export const saveToken = async (token: string) => {
  try {
    // setItemAsync를 사용하여 비동기로 암호화 저장
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (e) {
    console.error('토큰 저장 실패 (SecureStore)', e);
  }
};

// 토큰 가져오기
export const getToken = async () => {
  try {
    // getItemAsync로 안전하게 복호화해서 가져옴
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (e) {
    console.error('토큰 불러오기 실패 (SecureStore)', e);
    return null;
  }
};

// 토큰 삭제
export const removeToken = async () => {
  try {
    // deleteItemAsync로 키체인/키스토어에서 삭제
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (e) {
    console.error('토큰 삭제 실패 (SecureStore)', e);
  }
};