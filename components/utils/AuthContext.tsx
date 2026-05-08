import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, DeviceEventEmitter } from 'react-native';
import { authApi } from './api';
import { getAccessToken, removeTokens, saveTokens } from './authStore';

interface User {
  id: number;
  email: string;
  nickname: string;
  name?: string;
  role: string;
  profileImageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  loginWithToken: (accessToken: string, refreshToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 세션 만료 이벤트 리스너 등록 (React Native DeviceEventEmitter 사용)
  useEffect(() => {
    const handleSessionExpired = async () => {
      console.log('[Auth] 세션 만료 이벤트 수신, 로그아웃 처리 중...');
      await removeTokens();
      setUser(null);
      Alert.alert('알림', '세션이 만료되었습니다. 다시 로그인해 주세요.');
    };

    const subscription = DeviceEventEmitter.addListener('auth-session-expired', handleSessionExpired);

    return () => {
      subscription.remove();
    };
  }, []);

  // 2. 앱 기동 시 토큰 확인 및 자동 로그인
  useEffect(() => {
    const loadUser = async () => {
      try {
        const accessToken = await getAccessToken();

        if (accessToken) {
          console.log('[Auth] 저장된 토큰 발견, 사용자 정보 조회 중...');
          // 인터셉터가 getMyInfo 호출 시 만료되었다면 알아서 갱신 시도
          const userData = await authApi.getMyInfo();
          
          if (userData && (userData.id || userData.email)) {
            console.log('[Auth] 자동 로그인 성공:', userData.email);
            setUser(userData);
          } else {
            throw new Error('Invalid user data');
          }
        } else {
          console.log('[Auth] 기기에 저장된 토큰이 없습니다.');
        }
      } catch (e: any) {
        // 인터셉터에서 갱신에 실패하면 여기로 에러가 전파됨
        console.log('[Auth] 자동 로그인 실패:', e.message);
        // 세션 만료 이벤트가 별도로 발생하므로 여기서 중복 처리는 지양하지만, 
        // 혹시 모를 상황을 위해 토큰을 지워줍니다.
        await removeTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // 2. 일반 로그인
  const login = async (credentials: any) => {
    try {
      const response = await authApi.login(credentials);
      
      // API 응답 구조에 맞게 데이터 추출
      const access = response.accessToken || response.data?.accessToken;
      const refresh = response.refreshToken || response.data?.refreshToken;

      if (!access || !refresh) {
        throw new Error("서버 응답에 토큰이 누락되었습니다.");
      }

      await saveTokens(access, refresh);
      const userData = await authApi.getMyInfo();
      setUser(userData);
    } catch (error) {
      await removeTokens();
      throw error;
    }
  };

  // 3. 로그아웃
  const logout = async () => {
    try {
      await removeTokens();
    } catch (error) {
      console.error('[Auth] 로그아웃 중 에러:', error);
    } finally {
      setUser(null);
    }
  };

  // 4. 소셜 로그인 처리
  const loginWithToken = async (accessToken: string, refreshToken: string) => {
    try {
      if (!accessToken || !refreshToken) {
        throw new Error("유효하지 않은 소셜 토큰입니다.");
      }

      await saveTokens(accessToken, refreshToken);
      const userData = await authApi.getMyInfo();
      setUser(userData);
    } catch (error) {
      console.error("[Auth] 소셜 로그인 처리 실패:", error);
      await removeTokens();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, login, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
