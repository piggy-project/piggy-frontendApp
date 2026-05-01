import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
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

  // 1. 앱 기동 시 토큰 확인 및 자동 로그인
  useEffect(() => {
    const loadUser = async () => {
      try {
        const accessToken = await getAccessToken();

        if (accessToken) {
          // 인터셉터가 getMyInfo 호출 시 만료되었다면 알아서 갱신
          const userData = await authApi.getMyInfo();
          
          // 데이터 유효성 검사 추가 (id나 email 등 필수 필드가 있어야 함)
          if (userData && (userData.id || userData.email)) {
            setUser(userData);
          } else {
            console.log('[Auth] 유효하지 않은 사용자 데이터:', userData);
            throw new Error('Invalid user data');
          }
        } else {
          console.log('[Auth] 기기에 저장된 토큰이 없습니다.');
        }
      } catch (e) {
        console.log('[Auth] 세션 만료 (리프레시 토큰까지 만료됨)');
        await removeTokens();
        setUser(null);
        Alert.alert('알림', '세션이 만료되었습니다. 다시 로그인해 주세요.');
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