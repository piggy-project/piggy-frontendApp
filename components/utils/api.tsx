import { getToken } from './authStore'; // 금고에서 토큰 가져오는 함수 임포트

// 1. 기본 서버 주소 설정 (안드로이드 에뮬레이터 기준)
const BASE_URL = 'https://piggys.mooo.com';

// 2. Fetch를 더 편하게 쓰기 위한 래퍼 함수 (Interceptor 역할)
const request = async (endpoint: string, options: RequestInit = {}) => {
  try {
    // 저장된 토큰 가져오기
    const token = await getToken();

    // 헤더 설정 (기본적으로 JSON, 토큰 있으면 추가)
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 실제 요청 보내기
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 응답 데이터 파싱
    const data = await response.json().catch(() => ({}));

    // 성공(200~299)이 아니면 에러 던지기
    if (!response.ok) {
      throw { status: response.status, message: data.message || '서버 오류 발생', data };
    }

    return data;
  } catch (error: any) {
    // 네트워크 에러나 서버 에러를 여기서 통일해서 처리 가능
    console.error('API Error:', error);
    throw error;
  }
};

// 3. 실제 사용할 API 함수들을 모아두기
export const authApi = {
  // 이메일 중복 체크
  checkEmail: (email: string) => {
    return request(`/users/check-email?email=${email}`, { method: 'POST' });
},

  // 회원가입
  signUp: (userData: any) => {
    return request('/users/sign-up', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // 로그인
  login: (credentials: any) => {
    return request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  // 마이페이지 정보 조회
  getMyInfo: () => {
    return request('/users/me', { method: 'GET' });
  },
  // 닉네임 중복 체크
  checkNickname: (nickname: string) => {
    return request(`/users/check-nickname?nickname=${nickname}`, { method: 'POST' });
  },
};

export const exchangeApi = {
  // 최신 환율 리스트 가져오기
  getLatestRates: () => {
    return request('/api/exchange/rates', { method: 'GET' });
  },
  // 2. 특정 통화 상세 정보 가져오기 (추가)
  getExchangeDetail: (code: string) => {
    // URL 파라미터로 통화 코드(USD, JPY 등)를 전달합니다.
    return request(`/api/exchange/detail/${code}`, { method: 'GET' });
  },
};