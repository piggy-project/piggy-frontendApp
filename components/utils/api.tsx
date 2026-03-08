import { getToken } from './authStore'; // 금고에서 토큰 가져오는 함수 임포트

// 1. 기본 서버 주소 설정 (안드로이드 에뮬레이터 기준) - 현재 내 ip
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

    const responseText = await response.text();

    // 응답 데이터 파싱
    let data: any = {};
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.log("🚨 JSON 파싱 실패:", responseText);
        data = { message: responseText };
      }
    }

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
  // 추가 정보 업데이트 (소셜 로그인용)
  updateAdditionalInfo: (data: { nickname: string; birth: string; phoneNum: string }) => {
    return request('/users/additional-info', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  cancelSocialSignup: () => {
    return request('/users/social-cancel', { method: 'DELETE' });
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
  // 1. 환율 리스트 및 정렬 필터 (이제 얘가 메인입니다!)
  // sort: RISE(급상승), FALL(급하락), HIGH(높은순), LOW(낮은순)
  getExchangeRanking: (sort: string = 'RISE') => {
    return request(`/api/exchange/ranking?sort=${sort}`, {
      method: 'GET'
    });
  },
  // 2. 특정 통화 상세 정보 가져오기
  getExchangeDetail: (code: string) => {
    // URL 파라미터로 통화 코드(USD, JPY 등)를 전달합니다.
    return request(`/api/exchange/detail/${code}`, { method: 'GET' });
  },
  // 3. 특정 통화의 과거 기록 가져오기
  getExchangeHistory: (code: string) => {
    return request(`/api/exchange/history?code=${code}`, { method: 'GET' });
  },
};

export const shoppingApi = {
  // 1. 가격 비교 검색
  comparePrices: (query: string, currencyCode: string) => {
    return request(
      `/api/v1/shopping/compare?query=${encodeURIComponent(query)}&currencyCode=${currencyCode}`,
      { method: 'GET' }
    );
  },
  // 2. OCR 스캔 요청 
  scanProductPrice: (base64Image: string, currency: string) => {
    return request('/api/v1/ocr/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        currency: currency
      }),
    });
  },
  // 3. 인기 상품 조회(많이 검색한 아이템)
  getPopularItems: (currencyCode: string) => {
    return request(`/api/v1/shopping/popular?currencyCode=${currencyCode}`, {
      method: 'GET'
    });
  },
  // 4. 추천 음식
  getRegionalFoods: (currencyCode: string) => {
    return request(`/food?currencyCode=${currencyCode}`, {
      method: 'GET'
    });
  }
};
export const communityApi = {
  // 1. 게시글 등록하기
  // category: '환율 수다방' | '여행 공유방' | '정보방'
  createPost: (postData: { title: string; content: string; category: string }) => {
    return request('/api/community', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  // 2. 게시글 목록 조회하기 (필터 및 검색 포함)
  getPosts: (category: string, search: string = '') => {
    const encodedCategory = encodeURIComponent(category);
    const encodedSearch = encodeURIComponent(search);
    return request(`/api/community?category=${encodedCategory}&search=${encodedSearch}`, {
      method: 'GET'
    });
  },

  // 3. 게시글 상세 조회 (게시글 클릭 시 사용)
  getPostDetail: (postId: number) => {
    return request(`/api/community/${postId}`, {
      method: 'GET'
    });
  },

  // 4. 게시글 삭제 (본인 글일 경우)
  deletePost: (postId: number) => {
    return request(`/api/community/${postId}`, {
      method: 'DELETE'
    });
  },
  // 5. 좋아요
  toggleLike: (postId: number) => {
    return request(`/api/community/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({})
    });
  },
  // 6. 댓글 쓰기
  createComment: (postId: number, content: string) => {
    return request(`/api/community/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
  // 7. 댓글 삭제
  deleteComment: (commentId: number) => {
    return request(`/api/community/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
  // 8. 댓글 목록 조회
  getComments: (postId: number) => {
    return request(`/api/community/${postId}/comments`, {
      method: 'GET',
    });
  },
};