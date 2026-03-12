import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from './api';
import { getToken, removeToken, saveToken } from './authStore';

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
  loginWithToken: (accessToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 앱 기동 시 자동 로그인 (SecureStore 금고 확인)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken();
        if (token) {
          // 토큰이 있으면 서버에서 최신 내 정보 가져오기
          const userData = await authApi.getMyInfo();
          setUser(userData);
        }
      } catch (e) {
        console.log('--- [AuthContext] 자동 로그인 실패 (토큰 만료 혹은 네트워크) ---');
        await removeToken(); // 실패 시 금고 비우기
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // 2. 로그인
  const login = async (credentials: any) => {
    try {
      const response = await authApi.login(credentials);
      const accessToken = response.accessToken;

      if (!accessToken) throw new Error("토큰이 존재하지 않습니다.");

      await saveToken(accessToken); // 금고에 암호화 저장
      const userData = await authApi.getMyInfo();
      setUser(userData);
    } catch (error) {
      console.error("로그인 프로세스 에러:", error);
      await removeToken(); 
      throw error;
    }
  };

  // 3. 로그아웃
  const logout = async () => {
    try {
      await removeToken(); // 금고 파쇄
    } catch (error) {
      console.error('--- [AuthContext] 토큰 삭제 중 에러 ---', error);
    } finally {
      setUser(null);
    }
  };

  // 4. 소셜 로그인 처리
  const loginWithToken = async (accessToken: string) => {
    try {
      await saveToken(accessToken);
      const userData = await authApi.getMyInfo();
      setUser(userData);
    } catch (error) {
      console.error("소셜 로그인 처리 실패:", error);
      await removeToken();
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