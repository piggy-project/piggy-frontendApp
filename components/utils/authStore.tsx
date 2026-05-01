import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// 액세스 토큰과 리프레시 토큰을 기기에 안전하게 저장합니다.
export const saveTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } catch (e) {
    console.error('[authStore] 토큰 저장 에러:', e);
  }
};

// 저장된 액세스 토큰을 가져옵니다.
export const getAccessToken = () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

// 저장된 리프레시 토큰을 가져옵니다.
export const getRefreshToken = () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

// 저장된 모든 토큰을 삭제합니다. (로그아웃 시 사용)
export const removeTokens = async () => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (e) {
    console.error('[authStore] 토큰 삭제 에러:', e);
  }
};