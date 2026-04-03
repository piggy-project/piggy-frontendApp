import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from './api';
import { getAccessToken, getRefreshToken, removeTokens, saveTokens } from './authStore';

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
          try {
            // 액세스 토큰으로 내 정보 가져오기
            const userData = await authApi.getMyInfo();
            setUser(userData);
          } catch (error) {
            // 토큰이 만료되었을 경우 리프레시 시도
            const refreshToken = await getRefreshToken();
            if (refreshToken) {
              const newTokens = await authApi.reissue(refreshToken);
              
              // 새 토큰 추출 (API 응답 구조에 따라 safe하게 추출)
              const nextAccess = newTokens.accessToken || newTokens.data?.accessToken;
              const nextRefresh = newTokens.refreshToken || newTokens.data?.refreshToken;

              if (nextAccess && nextRefresh) {
                await saveTokens(nextAccess, nextRefresh);
                const userData = await authApi.getMyInfo();
                setUser(userData);
              }
            }
          }
        }
      } catch (e) {
        console.log('[Auth] 세션 만료 혹은 인증 실패');
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