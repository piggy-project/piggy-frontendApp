import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from './api';
import { getToken, removeToken, saveToken } from './authStore'; // 토큰 저장소 함수들

// 유저 데이터 타입 정의
interface User {
  id: number;
  email: string;
  nickname: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  loginWithToken: (accessToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 앱 시작 시 토큰 체크 로딩

  
  // 1. 앱 켜질 때 자동 로그인 (토큰 있으면 유저정보 가져오기)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken();
        if (token) {
          const userData = await authApi.getMyInfo(); // /users/me 호출
          setUser(userData);
        }
      } catch (e) {
        console.log('자동 로그인 실패 (토큰 만료 등)');
        await removeToken();
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // 2. 로그인 함수 (로그인 -> 토큰저장 -> 내정보 가져오기)
  const login = async (credentials: any) => {
    try {
      // (1) 로그인 API 호출
      const response = await authApi.login(credentials);
      const accessToken = response.accessToken;

      if (!accessToken) {
        throw new Error("토큰이 존재하지 않습니다.");
      }

      // (2) 토큰 저장
      await saveToken(accessToken);

      // (3) 내 정보 가져오기 (/users/me)
      const userData = await authApi.getMyInfo();
      
      // (4) 상태 업데이트
      setUser(userData); 
      
    } catch (error) {
      console.error("로그인 프로세스 에러:", error);
      // 에러 나면 토큰 지워서 꼬이지 않게 함
      await removeToken(); 
      throw error;
    }
  };

  // 3. 로그아웃 함수
  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  // 4. 소셜 로그인 토큰만 받아서 바로 로그인 처리
  const loginWithToken = async (accessToken: string) => {
    try {
      // 1. 토큰 저장
      await saveToken(accessToken);

      // 2. 내 정보 가져오기 (/users/me)
      const userData = await authApi.getMyInfo();
      
      // 3. 상태 업데이트
      setUser(userData);
      
    } catch (error) {
      console.error("소셜 로그인 처리 실패:", error);
      await removeToken();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// 커스텀 훅 (컴포넌트에서 쉽게 쓰기 위함)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}